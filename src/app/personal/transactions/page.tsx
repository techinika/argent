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
import { personalTransactionSchema } from "@/lib/schemas";
import { PersonalTransaction, PersonalTransactionCategory } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";

const categories: { value: PersonalTransactionCategory; label: string }[] = [
  { value: "necessities", label: "Necessities" },
  { value: "debts", label: "Debt Payments" },
  { value: "needs", label: "Needs" },
  { value: "emergencies", label: "Emergencies" },
  { value: "income", label: "Income" },
  { value: "other", label: "Other" },
];

export default function PersonalTransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PersonalTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [formData, setFormData] = useState<{
    type: "income" | "expense";
    amount: number;
    category: PersonalTransactionCategory;
    description: string;
    date: Date;
  }>({
    type: "expense",
    amount: 0,
    category: "needs",
    description: "",
    date: new Date(),
  });
  const [error, setError] = useState("");

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    const q = query(
      collection(db, "personalTransactions"),
      where("userId", "==", user.uid),
      orderBy("date", "desc"),
    );
    const snap = await getDocs(q);
    setTransactions(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        date: d.data().date.toDate(),
      })) as PersonalTransaction[],
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const parsed = personalTransactionSchema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      setSaving(false);
      return;
    }
    try {
      await addDoc(collection(db, "personalTransactions"), {
        userId: user!.uid,
        type: formData.type,
        amount: formData.amount,
        category: formData.category,
        description: formData.description || "",
        date: formData.date,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setModalOpen(false);
      resetForm();
      fetchTransactions();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await deleteDoc(doc(db, "personalTransactions", id));
    fetchTransactions();
  };
  const resetForm = () =>
    setFormData({
      type: "expense",
      amount: 0,
      category: "needs",
      description: "",
      date: new Date(),
    });

  const filtered =
    filterCategory === "all"
      ? transactions
      : transactions.filter((t) => t.category === filterCategory);
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const byCategory = categories.map((cat) => ({
    ...cat,
    amount: transactions
      .filter((t) => t.category === cat.value && t.type === "expense")
      .reduce((s, t) => s + t.amount, 0),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Transactions
          </h1>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[{ value: "all", label: "All Categories" }, ...categories]}
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
          <div className="text-sm text-zinc-500">Total Income</div>
          <div className="text-2xl font-bold text-emerald-600">
            ${totalIncome.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Total Expenses</div>
          <div className="text-2xl font-bold text-red-600">
            ${totalExpenses.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Net</div>
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
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Spending by Category">
            <div className="space-y-3">
              {byCategory.map((cat) => (
                <div
                  key={cat.value}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span>{cat.label}</span>
                  <span className="font-semibold text-red-600">
                    ${cat.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Recent Transactions">
            {filtered.length === 0 ? (
              <p className="text-zinc-500">No transactions</p>
            ) : (
              <div className="space-y-3">
                {filtered.slice(0, 10).map((trans) => (
                  <div
                    key={trans.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium">{trans.category}</div>
                      <div className="text-xs text-zinc-500">
                        {trans.date.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${trans.type === "income" ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {trans.type === "income" ? "+" : "-"}$
                        {trans.amount.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(trans.id)}
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
        </div>
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
            label="Type"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "income" | "expense",
              })
            }
            options={[
              { value: "expense", label: "Expense" },
              { value: "income", label: "Income" },
            ]}
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
            required
          />
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as PersonalTransactionCategory,
              })
            }
            options={categories}
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
    </div>
  );
}
