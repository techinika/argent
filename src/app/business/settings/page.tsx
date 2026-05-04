"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useTheme } from "@/components/ui/ThemeProvider";
import { BusinessFeature } from "@/types/team";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const defaultFeatures: BusinessFeature[] = [
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
];

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "NGN", label: "NGN - Nigerian Naira" },
  { value: "KES", label: "KES - Kenyan Shilling" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "RWF", label: "RWF - Rwandan Franc" },
  { value: "FBU", label: "FBU - Burundian Franc" },
  { value: "UGX", label: "UGX - Ugandan Shilling" },
];

const dateFormats = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export default function BusinessSettingsPage() {
  const router = useRouter();
  const { user, firebaseUser } = useAuth();
  const { showToast } = useToast();
  const {  } = useTheme();
  const [businessName, setBusinessName] = useState("");
  const [currency, setCurrency] = useState("RWF");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [features, setFeatures] = useState<BusinessFeature[]>(defaultFeatures);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "businessSettings", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBusinessName(data.name || "");
        setCurrency(data.currency || "RWF");
        setDateFormat(data.dateFormat || "MM/DD/YYYY");
        setFeatures(data.features || defaultFeatures);
      } else {
        setBusinessName(user.displayName || "");
        await setDoc(docRef, {
          name: user.displayName || "",
          currency: "RWF",
          dateFormat: "MM/DD/YYYY",
          features: defaultFeatures,
          createdAt: new Date(),
        });
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, "businessSettings", user.uid);
      await setDoc(
        docRef,
        {
          name: businessName,
          currency,
          dateFormat,
          features,
          updatedAt: new Date(),
        },
        { merge: true },
      );
      showToast("Settings saved successfully", "success");
      setSaved(true);
      // Reset saved state after 2 seconds
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Error saving settings:", err);
      showToast("Failed to save settings", "error");
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  const checkCanSwitch = async () => {
    if (!user) return false;
    const transQ = query(
      collection(db, "businessTransactions"),
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
        { role: "personal", updatedAt: new Date() },
        { merge: true },
      );

      const transQ = query(
        collection(db, "personalTransactions"),
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
        doc(db, "personalSettings", user.uid),
        {
          displayName: user.displayName,
          currency: "RWF",
          dateFormat: "MM/DD/YYYY",
          emailNotifications: true,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      showToast("Account type changed to Personal", "success");
      router.push("/personal");
    } catch (err) {
      showToast("Failed to switch account type", "error");
    } finally {
      setSwitching(false);
      setSwitchAccountOpen(false);
    }
  };

  const toggleFeature = (featureId: string) => {
    setFeatures(
      features.map((f) =>
        f.id === featureId ? { ...f, enabled: !f.enabled } : f,
      ),
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Business Settings
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Manage your business profile and features
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <>
          <Card title="Account Type">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    Business Account
                  </p>
                  <p className="text-sm text-zinc-500">
                    Currently on business plan
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-full">
                  Active
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => setSwitchAccountOpen(true)}
              >
                Switch to Personal Account
              </Button>
              <p className="text-xs text-zinc-500">
                Note: You can only switch if you have no transactions
              </p>
            </div>
          </Card>

          <Card title="Theme">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Choose your preferred theme
            </p>
            <ThemeToggle />
          </Card>
          <Card title="Business Profile">
            <div className="space-y-4">
              <Input
                label="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
              />
              <div>
                <label
                  htmlFor="currency-select"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Currency
                </label>
                <select
                  id="currency-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
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
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800"
                >
                  {dateFormats.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleSave} loading={saving}>
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          </Card>

          <Card title="Feature Toggles">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Enable or disable features for your business account
            </p>
            <div className="space-y-3">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700"
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {feature.name}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {feature.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFeature(feature.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      feature.enabled
                        ? "bg-emerald-600"
                        : "bg-zinc-300 dark:bg-zinc-600"
                    }`}
                    aria-label={`Toggle ${feature.name}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        feature.enabled ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <ConfirmModal
            isOpen={switchAccountOpen}
            onClose={() => setSwitchAccountOpen(false)}
            onConfirm={handleSwitchAccount}
            title="Switch to Personal Account"
            message="Are you sure you want to switch to a personal account? This will give you access to personal finance features."
            confirmText="Switch Account"
            loading={switching}
          />
        </>
      )}
    </div>
  );
}
