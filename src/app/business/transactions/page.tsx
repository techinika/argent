"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { businessTransactionSchema } from "@/lib/schemas";
import { BusinessTransaction, BusinessTransactionType } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/context/ToastContext";

const transactionTypes: { value: BusinessTransactionType; label: string }[] = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
  { value: "saving", label: "Saving" },
  { value: "investment", label: "Investment" },
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Debit" },
];

export default function BusinessTransactionsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<BusinessTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [formData, setFormData] = useState({
    type: "expense" as BusinessTransactionType,
    amount: 0,
    category: "",
    description: "",
    date: new Date(),
    budgetId: "",
  });
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "businessTransactions"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as BusinessTransaction[];
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const parsed = businessTransactionSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Validation failed";
      setError(firstError);
      setSaving(false);
      return;
    }

    try {
      await addDoc(collection(db, "businessTransactions"), {
        userId: user!.uid,
        type: formData.type,
        amount: formData.amount,
        category: formData.category,
        description: formData.description || "",
        date: formData.date,
        budgetId: formData.budgetId || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setModalOpen(false);
      resetForm();
      fetchTransactions();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to add transaction",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "businessTransactions", deleteId));
    setDeleteId(null);
    fetchTransactions();
    showToast("Transaction deleted", "success");
  };

  const resetForm = () => {
    setFormData({
      type: "expense",
      amount: 0,
      category: "",
      description: "",
      date: new Date(),
      budgetId: "",
    });
  };

  const filteredTransactions =
    filterType === "all"
      ? transactions
      : transactions.filter((t) => t.type === filterType);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Transactions
          </h1>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: "all", label: "All Types" },
              ...transactionTypes,
            ]}
          />
        </div>
        <Button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          + Add Transaction
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Total Income
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            ${totalIncome.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Total Expenses
          </div>
          <div className="text-2xl font-bold text-red-600">
            ${totalExpenses.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Net</div>
          <div
            className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            ${(totalIncome - totalExpenses).toLocaleString()}
          </div>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <Card>
          <p className="text-center text-zinc-500">No transactions found</p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-zinc-500">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-zinc-500">
                    Type
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-zinc-500">
                    Category
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-zinc-500">
                    Description
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-zinc-500">
                    Amount
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((trans) => (
                  <tr key={trans.id} className="border-b last:border-0">
                    <td className="py-3 px-2">
                      {trans.date.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs ${
                          trans.type === "income"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : trans.type === "expense"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : trans.type === "saving"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : trans.type === "investment"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {trans.type}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium">{trans.category}</td>
                    <td className="py-3 px-2 text-zinc-500">
                      {trans.description || "-"}
                    </td>
                    <td
                      className={`py-3 px-2 text-right font-semibold ${
                        trans.type === "income"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {trans.type === "income" ? "+" : "-"}$
                      {trans.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteId(trans.id)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Transaction"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
              {error}
            </div>
          )}
          <Select
            label="Transaction Type"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as BusinessTransactionType,
              })
            }
            options={transactionTypes}
          />
          <Input
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            placeholder="e.g., Sales, Rent, Utilities"
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Optional description"
          />
          <Input
            label="Date"
            type="date"
            value={formData.date.toISOString().split("T")[0]}
            onChange={(e) =>
              setFormData({ ...formData, date: new Date(e.target.value) })
            }
            required
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
              Add
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
