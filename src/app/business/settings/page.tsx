"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { BusinessFeature } from "@/types/team";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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

export default function BusinessSettingsPage() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [features, setFeatures] = useState<BusinessFeature[]>(defaultFeatures);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "businessSettings", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBusinessName(data.name || "");
        setFeatures(data.features || defaultFeatures);
      } else {
        setBusinessName(user.displayName);
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
      await updateDoc(docRef, {
        name: businessName,
        features,
        updatedAt: new Date(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
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
          <Card title="Business Profile">
            <div className="space-y-4">
              <Input
                label="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
              />
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
        </>
      )}
    </div>
  );
}
