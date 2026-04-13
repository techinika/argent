"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  getDoc,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { debtSchema } from "@/lib/schemas";
import { Debt, CurrentAccount } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/context/ToastContext";

export default function PersonalDebtsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [currentAccount, setCurrentAccount] = useState<CurrentAccount | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    type: "owed_to" | "owed_by";
    personName: string;
    amount: string;
    description: string;
    dueDate: string;
  }>({
    type: "owed_to",
    personName: "",
    amount: "",
    description: "",
    dueDate: "",
  });
  const [error, setError] = useState("");

  const fetchDebts = useCallback(async () => {
    if (!user) return;
    const q = query(collection(db, "debts"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    setDebts(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        dueDate: d.data().dueDate?.toDate(),
      })) as Debt[],
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
    fetchDebts();
  }, [fetchDebts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setSaving(true);

    try {
      const parsed = debtSchema.safeParse({
        ...formData,
        amount,
      });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message);
        setSaving(false);
        return;
      }

      if (formData.type === "owed_to") {
        await runTransaction(db, async (transaction) => {
          const accountRef = doc(db, "currentAccounts", user!.uid);
          const accountDoc = await transaction.get(accountRef);

          if (!accountDoc.exists()) {
            throw new Error("Account not found");
          }

          const accountData = accountDoc.data() as CurrentAccount;

          transaction.update(accountRef, {
            balance: accountData.balance + amount,
            totalBorrowed: accountData.totalBorrowed + amount,
            lastUpdated: new Date(),
          });

          transaction.set(doc(collection(db, "debts")), {
            userId: user!.uid,
            type: formData.type,
            personName: formData.personName,
            amount,
            description: formData.description || "",
            dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
            cleared: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      } else {
        const data = {
          userId: user!.uid,
          type: formData.type,
          personName: formData.personName,
          amount,
          description: formData.description || "",
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          cleared: editingDebt?.cleared || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        if (editingDebt) {
          await updateDoc(doc(db, "debts", editingDebt.id), {
            ...data,
            updatedAt: new Date(),
          });
        } else {
          await addDoc(collection(db, "debts"), data);
        }
      }

      setModalOpen(false);
      resetForm();
      fetchDebts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "debts", deleteId));
    setDeleteId(null);
    fetchDebts();
    showToast("Debt deleted", "success");
  };
  const handleClear = async (debt: Debt) => {
    await updateDoc(doc(db, "debts", debt.id), {
      cleared: !debt.cleared,
      updatedAt: new Date(),
    });
    fetchDebts();
    showToast(debt.cleared ? "Debt restored" : "Debt cleared", "success");
  };

  const resetForm = () => {
    setFormData({
      type: "owed_to",
      personName: "",
      amount: "",
      description: "",
      dueDate: "",
    });
    setEditingDebt(null);
  };
  const openEdit = (debt: Debt) => {
    setEditingDebt(debt);
    setFormData({
      type: debt.type,
      personName: debt.personName,
      amount: debt.amount.toString(),
      description: debt.description || "",
      dueDate: debt.dueDate ? debt.dueDate.toISOString().split("T")[0] : "",
    });
    setModalOpen(true);
  };

  const activeDebts = debts.filter((d) => !d.cleared);
  const clearedDebts = debts.filter((d) => d.cleared);
  const owedTo = activeDebts
    .filter((d) => d.type === "owed_to")
    .reduce((s, d) => s + d.amount, 0);
  const owedBy = activeDebts
    .filter((d) => d.type === "owed_by")
    .reduce((s, d) => s + d.amount, 0);

  const filtered =
    filter === "all"
      ? activeDebts
      : activeDebts.filter((d) => d.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Debts & Receivables
          </h1>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: "all", label: "All" },
              { value: "owed_to", label: "You Owe" },
              { value: "owed_by", label: "Owed to You" },
            ]}
          />
        </div>
        <Button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          + Add Debt
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-zinc-500">You Owe</div>
          <div className="text-2xl font-bold text-red-600">
            ${owedTo.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Owed to You</div>
          <div className="text-2xl font-bold text-emerald-600">
            ${owedBy.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Net Position</div>
          <div
            className={`text-2xl font-bold ${owedBy - owedTo >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            ${(owedBy - owedTo).toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Active</div>
          <div className="text-2xl font-bold">{activeDebts.length}</div>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Active Debts">
            {filtered.length === 0 ? (
              <p className="text-zinc-500">No active debts</p>
            ) : (
              <div className="space-y-3">
                {filtered.map((debt) => (
                  <div
                    key={debt.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium">{debt.personName}</div>
                      <div className="text-xs text-zinc-500">
                        {debt.description}{" "}
                        {debt.dueDate &&
                          ` - Due: ${debt.dueDate.toLocaleDateString()}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${debt.type === "owed_to" ? "text-red-600" : "text-emerald-600"}`}
                      >
                        ${debt.amount.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleClear(debt)}
                        className="text-emerald-400 hover:text-emerald-600"
                        aria-label="Clear"
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(debt)}
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
                        onClick={() => setDeleteId(debt.id)}
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
                ))}
              </div>
            )}
          </Card>

          <Card title="Cleared">
            {clearedDebts.length === 0 ? (
              <p className="text-zinc-500">No cleared debts</p>
            ) : (
              <div className="space-y-3">
                {clearedDebts.map((debt) => (
                  <div
                    key={debt.id}
                    className="flex justify-between items-center py-2 border-b last:border-0 text-zinc-400"
                  >
                    <div>
                      <div className="line-through">{debt.personName}</div>
                      <div className="text-xs">
                        ${debt.amount.toLocaleString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleClear(debt)}
                      className="text-zinc-400 hover:text-zinc-600"
                      aria-label="Restore"
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDebt ? "Edit Debt" : "Add Debt"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
              {error}
            </div>
          )}
          <Select
            label="Type"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "owed_to" | "owed_by",
              })
            }
            options={[
              { value: "owed_to", label: "You Owe" },
              { value: "owed_by", label: "Owed to You" },
            ]}
          />
          <Input
            label="Person Name"
            value={formData.personName}
            onChange={(e) =>
              setFormData({ ...formData, personName: e.target.value })
            }
            placeholder="Name"
            required
          />
          <Input
            label="Amount"
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
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Optional"
          />
          <Input
            label="Due Date (Optional)"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
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
              {editingDebt ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Debt"
        message="Are you sure you want to delete this debt?"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
