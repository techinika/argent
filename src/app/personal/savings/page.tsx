"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { savingsSchema } from "@/lib/schemas";
import { PersonalSavings, CurrentAccount } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/context/ToastContext";

export default function PersonalSavingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [savings, setSavings] = useState<PersonalSavings[]>([]);
  const [currentAccount, setCurrentAccount] = useState<CurrentAccount | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSavings, setEditingSavings] = useState<PersonalSavings | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    targetAmount: "",
  });
  const [error, setError] = useState("");

  const fetchSavings = useCallback(async () => {
    if (!user) return;
    const q = query(
      collection(db, "personalSavings"),
      where("userId", "==", user.uid),
    );
    const snap = await getDocs(q);
    setSavings(
      snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PersonalSavings[],
    );

    const accountDoc = await getDoc(doc(db, "currentAccounts", user.uid));
    if (accountDoc.exists()) {
      setCurrentAccount({
        id: accountDoc.id,
        ...accountDoc.data(),
        lastUpdated: accountDoc.data().lastUpdated?.toDate(),
      } as CurrentAccount);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSavings();
  }, [fetchSavings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (currentAccount && amount > currentAccount.balance) {
      setError(
        `Insufficient balance. Your current balance is $${currentAccount.balance.toFixed(2)}`,
      );
      return;
    }

    setSaving(true);

    try {
      const parsed = savingsSchema.safeParse({
        name: formData.name,
        amount,
        targetAmount: formData.targetAmount
          ? parseFloat(formData.targetAmount)
          : undefined,
      });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message);
        setSaving(false);
        return;
      }

      await runTransaction(db, async (transaction) => {
        const accountRef = doc(db, "currentAccounts", user!.uid);
        const accountDoc = await transaction.get(accountRef);

        if (!accountDoc.exists()) {
          throw new Error("Account not found");
        }

        const accountData = accountDoc.data() as CurrentAccount;
        const newBalance = accountData.balance - amount;

        transaction.update(accountRef, {
          balance: newBalance,
          totalSavings: accountData.totalSavings + amount,
          lastUpdated: new Date(),
        });

        if (editingSavings) {
          transaction.update(doc(db, "personalSavings", editingSavings.id), {
            name: formData.name,
            amount,
            targetAmount: formData.targetAmount
              ? parseFloat(formData.targetAmount)
              : undefined,
            updatedAt: new Date(),
          });
        } else {
          transaction.set(doc(collection(db, "personalSavings")), {
            userId: user!.uid,
            name: formData.name,
            amount,
            targetAmount: formData.targetAmount
              ? parseFloat(formData.targetAmount)
              : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });

      setModalOpen(false);
      resetForm();
      fetchSavings();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "personalSavings", deleteId));
    setDeleteId(null);
    fetchSavings();
    showToast("Savings deleted", "success");
  };

  const resetForm = () => {
    setFormData({ name: "", amount: "", targetAmount: "" });
    setEditingSavings(null);
  };
  const openEdit = (s: PersonalSavings) => {
    setEditingSavings(s);
    setFormData({
      name: s.name,
      amount: s.amount.toString(),
      targetAmount: s.targetAmount?.toString() || "",
    });
    setModalOpen(true);
  };

  const totalSavings = savings.reduce((s, svs) => s + svs.amount, 0);
  const totalTarget = savings.reduce(
    (s, svs) => s + (svs.targetAmount || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Savings
        </h1>
        <Button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          + Add Savings
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-zinc-500">Total Savings</div>
          <div className="text-2xl font-bold text-blue-600">
            ${totalSavings.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Total Target</div>
          <div className="text-2xl font-bold">
            ${totalTarget.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Account Count</div>
          <div className="text-2xl font-bold">{savings.length}</div>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <Card title="Your Savings Accounts">
          {savings.length === 0 ? (
            <p className="text-zinc-500">No savings accounts</p>
          ) : (
            <div className="space-y-4">
              {savings.map((s) => {
                const progress = s.targetAmount
                  ? (s.amount / s.targetAmount) * 100
                  : 0;
                return (
                  <div key={s.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-zinc-500">
                          ${s.amount.toLocaleString()}{" "}
                          {s.targetAmount &&
                            `/ ${s.targetAmount.toLocaleString()}`}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="text-zinc-400 hover:text-zinc-600"
                          aria-label="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(s.id)}
                          className="text-zinc-400 hover:text-red-600"
                          aria-label="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {s.targetAmount && (
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSavings ? "Edit Savings" : "Add Savings"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
              {error}
            </div>
          )}
          <Input
            label="Account Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Emergency Fund, Vacation"
            required
          />
          <Input
            label="Current Amount"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
            placeholder="0.00"
            min="0"
            required
          />
          {currentAccount && (
            <p className="text-xs text-zinc-500">
              Available balance: ${currentAccount.balance.toFixed(2)}
            </p>
          )}
          <Input
            label="Target Amount (Optional)"
            type="number"
            value={formData.targetAmount}
            onChange={(e) =>
              setFormData({
                ...formData,
                targetAmount: e.target.value,
              })
            }
            placeholder="0.00"
            min="0"
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={saving}>
              {editingSavings ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Savings"
        message="Are you sure you want to delete this savings account?"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
