"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useAdPreferences } from "@/context/AdPreferencesContext";
import { useTheme } from "@/components/ui/ThemeProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface PersonalSettings {
  displayName: string;
  currency: string;
  dateFormat: string;
  emailNotifications: boolean;
  monthlyBudgetLimit: number;
  emergencyFundTarget: number;
}

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "NGN", label: "NGN - Nigerian Naira" },
  { value: "KES", label: "KES - Kenyan Shilling" },
  { value: "INR", label: "INR - Indian Rupee" },
];

const dateFormats = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export default function PersonalSettingsPage() {
  const router = useRouter();
  const { user, firebaseUser } = useAuth();
  const { showToast } = useToast();
  const { showAds, setShowAds, adsEnabled } = useAdPreferences();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PersonalSettings>({
    displayName: "",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    emailNotifications: true,
    monthlyBudgetLimit: 0,
    emergencyFundTarget: 0,
  });
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "personalSettings", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as PersonalSettings);
      } else {
        setSettings((prev) => ({
          ...prev,
          displayName: user.displayName || "",
        }));
        await setDoc(docRef, { ...settings, displayName: user.displayName });
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  }, [user, settings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveProfile = async () => {
    if (!user || !firebaseUser) return;
    setSaving(true);
    try {
      await updateProfile(firebaseUser, { displayName: settings.displayName });
      const docRef = doc(db, "personalSettings", user.uid);
      await setDoc(
        docRef,
        { displayName: settings.displayName, updatedAt: new Date() },
        { merge: true },
      );
      showToast("Profile updated successfully", "success");
    } catch (err) {
      console.error("Error saving profile:", err);
      showToast("Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, "personalSettings", user.uid);
      await setDoc(
        docRef,
        {
          currency: settings.currency,
          dateFormat: settings.dateFormat,
          emailNotifications: settings.emailNotifications,
          monthlyBudgetLimit: settings.monthlyBudgetLimit,
          emergencyFundTarget: settings.emergencyFundTarget,
          updatedAt: new Date(),
        },
        { merge: true },
      );
      showToast("Preferences saved successfully", "success");
    } catch (err) {
      console.error("Error saving preferences:", err);
      showToast("Failed to save preferences", "error");
    } finally {
      setSaving(false);
    }
  };

  const checkCanSwitch = async () => {
    if (!user) return false;
    const transQ = query(
      collection(db, "personalTransactions"),
      where("userId", "==", user.uid),
    );
    const transSnap = await getDocs(transQ);
    return transSnap.empty;
  };

  const handleSwitchAccount = async () => {
    if (!user || !firebaseUser) return;
    setSwitching(true);
    try {
      const canSwitch = await checkCanSwitch();
      if (!canSwitch) {
        showToast(
          "Cannot switch account: You have existing transactions",
          "error",
        );
        setSwitchAccountOpen(false);
        return;
      }

      await updateProfile(firebaseUser, { displayName: user.displayName });
      await setDoc(
        doc(db, "users", user.uid),
        { role: "business", updatedAt: new Date() },
        { merge: true },
      );

      const transQ = query(
        collection(db, "businessTransactions"),
        where("userId", "==", user.uid),
      );
      const transSnap = await getDocs(transQ);
      if (transSnap.empty) {
        await setDoc(doc(db, "currentAccounts", user.uid), {
          userId: user.uid,
          balance: 0,
          totalIncome: 0,
          totalExpenses: 0,
          totalSavings: 0,
          totalBorrowed: 0,
          lastUpdated: new Date(),
        });
      }

      await setDoc(
        doc(db, "businessSettings", user.uid),
        {
          name: user.displayName || "",
          features: [
            {
              id: "1",
              name: "Budget Alerts",
              key: "budget_alerts",
              enabled: true,
              description: "Get notified when approaching budget limits",
            },
            {
              id: "2",
              name: "Monthly Reports",
              key: "monthly_reports",
              enabled: true,
              description: "Generate monthly financial reports",
            },
            {
              id: "3",
              name: "Invoice Generation",
              key: "invoices",
              enabled: false,
              description: "Create and send invoices to clients",
            },
            {
              id: "4",
              name: "Tax Calculations",
              key: "tax_calc",
              enabled: false,
              description: "Automatic tax calculations",
            },
            {
              id: "5",
              name: "Multi-Currency",
              key: "multi_currency",
              enabled: false,
              description: "Handle multiple currencies",
            },
            {
              id: "6",
              name: "API Access",
              key: "api_access",
              enabled: false,
              description: "Programmatic access to your data",
            },
          ],
          updatedAt: new Date(),
        },
        { merge: true },
      );

      showToast("Account type changed to Business", "success");
      router.push("/business");
    } catch (err) {
      showToast("Failed to switch account type", "error");
    } finally {
      setSwitching(false);
      setSwitchAccountOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Settings
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Manage your personal finance preferences
        </p>
      </div>

      <Card title="Theme">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Choose your preferred theme
        </p>
        <ThemeToggle />
      </Card>

      <Card title="Profile">
        <div className="flex items-center gap-6 mb-6">
          <Avatar
            src={firebaseUser?.photoURL || undefined}
            name={settings.displayName}
            size="xl"
          />
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Profile Photo
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Managed by your authentication provider
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            label="Display Name"
            value={settings.displayName}
            onChange={(e) =>
              setSettings({ ...settings, displayName: e.target.value })
            }
            placeholder="Your name"
          />
          <Input
            label="Email"
            value={user?.email || ""}
            disabled
            className="bg-zinc-100 dark:bg-zinc-800"
          />
          <Button onClick={handleSaveProfile} loading={saving}>
            Save Profile
          </Button>
        </div>
      </Card>

      <Card title="Preferences">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="currency-select"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Currency
            </label>
            <select
              id="currency-select"
              value={settings.currency}
              onChange={(e) =>
                setSettings({ ...settings, currency: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800"
            >
              {currencies.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="date-format-select"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Date Format
            </label>
            <select
              id="date-format-select"
              value={settings.dateFormat}
              onChange={(e) =>
                setSettings({ ...settings, dateFormat: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800"
            >
              {dateFormats.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-zinc-900 dark:text-white">
                Email Notifications
              </p>
              <p className="text-sm text-zinc-500">
                Receive updates about your finances
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  emailNotifications: !settings.emailNotifications,
                })
              }
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.emailNotifications
                  ? "bg-emerald-600"
                  : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          <Button onClick={handleSavePreferences} loading={saving}>
            Save Preferences
          </Button>
        </div>
      </Card>

      <Card title="Ad Preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-zinc-900 dark:text-white">
                Show Ads in Dashboard
              </p>
              <p className="text-sm text-zinc-500">
                Disable to hide advertisements
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAds(!showAds)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                showAds ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  showAds ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
          {!showAds && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Ads are disabled. You won't see advertisements in your dashboard.
            </p>
          )}
        </div>
      </Card>

      <Card title="Account Type">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div>
              <p className="font-medium text-zinc-900 dark:text-white">
                Personal Account
              </p>
              <p className="text-sm text-zinc-500">
                Currently on personal plan
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-full">
              Active
            </span>
          </div>
          <Button variant="outline" onClick={() => setSwitchAccountOpen(true)}>
            Switch to Business Account
          </Button>
          <p className="text-xs text-zinc-500">
            Note: You can only switch if you have no transactions
          </p>
        </div>
      </Card>

      <Card title="Budget Targets">
        <div className="space-y-4">
          <Input
            label="Monthly Budget Limit"
            type="number"
            value={settings.monthlyBudgetLimit}
            onChange={(e) =>
              setSettings({
                ...settings,
                monthlyBudgetLimit: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="0.00"
          />
          <Input
            label="Emergency Fund Target"
            type="number"
            value={settings.emergencyFundTarget}
            onChange={(e) =>
              setSettings({
                ...settings,
                emergencyFundTarget: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="0.00"
          />
          <Button onClick={handleSavePreferences} loading={saving}>
            Save Targets
          </Button>
        </div>
      </Card>

      <ConfirmModal
        isOpen={switchAccountOpen}
        onClose={() => setSwitchAccountOpen(false)}
        onConfirm={handleSwitchAccount}
        title="Switch to Business Account"
        message="Are you sure you want to switch to a business account? This will give you access to business finance features."
        confirmText="Switch Account"
        loading={switching}
      />
    </div>
  );
}
