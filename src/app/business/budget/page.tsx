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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { businessBudgetSchema } from "@/lib/schemas";
import { BusinessBudget } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";

export default function BusinessBudgetPage() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<BusinessBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BusinessBudget | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<{
    type: "monthly" | "oneTimeExpense" | "oneTimeIncome";
    amount: number;
    category: string;
    description: string;
    month: number;
    year: number;
  }>({
    type: "monthly",
    amount: 0,
    category: "",
    description: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [error, setError] = useState("");

  const fetchBudgets = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "businessBudgets"),
        where("userId", "==", user.uid),
        orderBy("year", "desc"),
        orderBy("month", "desc"),
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as BusinessBudget[];
      setBudgets(data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const parsed = businessBudgetSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Validation failed";
      setError(firstError);
      setSaving(false);
      return;
    }

    try {
      const budgetData = {
        userId: user!.uid,
        type: formData.type,
        amount: formData.amount,
        category: formData.category,
        description: formData.description || "",
        month: formData.type === "monthly" ? formData.month : undefined,
        year: formData.year,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (editingBudget) {
        await updateDoc(doc(db, "businessBudgets", editingBudget.id), {
          ...budgetData,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, "businessBudgets"), budgetData);
      }

      setModalOpen(false);
      resetForm();
      fetchBudgets();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save budget");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    await deleteDoc(doc(db, "businessBudgets", id));
    fetchBudgets();
  };

  const resetForm = () => {
    setFormData({
      type: "monthly",
      amount: 0,
      category: "",
      description: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    setEditingBudget(null);
  };

  const openEdit = (budget: BusinessBudget) => {
    setEditingBudget(budget);
    setFormData({
      type: budget.type,
      amount: budget.amount,
      category: budget.category,
      description: budget.description || "",
      month: budget.month || new Date().getMonth() + 1,
      year: budget.year,
    });
    setModalOpen(true);
  };

  const currentYear = new Date().getFullYear();
  const yearBudgets = budgets.filter((b) => b.year === currentYear);
  const monthlyBudgets = yearBudgets.filter((b) => b.type === "monthly");
  const oneTimeExpenses = yearBudgets.filter(
    (b) => b.type === "oneTimeExpense",
  );
  const oneTimeIncome = yearBudgets.filter((b) => b.type === "oneTimeIncome");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Budgets
        </h1>
        <Button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          + Add Budget
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <Card title={`${currentYear} Monthly Budgets`}>
            {monthlyBudgets.length === 0 ? (
              <p className="text-zinc-500">No monthly budgets set</p>
            ) : (
              <div className="space-y-3">
                {monthlyBudgets.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium">{budget.category}</div>
                      <div className="text-xs text-zinc-500">
                        Month {budget.month}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        ${budget.amount.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEdit(budget)}
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
                        onClick={() => handleDelete(budget.id)}
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
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-semibold">
                <span>Total Monthly</span>
                <span>
                  $
                  {(
                    monthlyBudgets.reduce((s, b) => s + b.amount, 0) * 12
                  ).toLocaleString()}
                  /yr
                </span>
              </div>
            </div>
          </Card>

          <Card title={`${currentYear} One-Time Expenses`}>
            {oneTimeExpenses.length === 0 ? (
              <p className="text-zinc-500">No one-time expenses set</p>
            ) : (
              <div className="space-y-3">
                {oneTimeExpenses.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium">{budget.category}</div>
                      <div className="text-xs text-zinc-500">
                        {budget.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-red-600">
                        ${budget.amount.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEdit(budget)}
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
                        onClick={() => handleDelete(budget.id)}
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
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-red-600">
                  $
                  {oneTimeExpenses
                    .reduce((s, b) => s + b.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          <Card title={`${currentYear} One-Time Income`}>
            {oneTimeIncome.length === 0 ? (
              <p className="text-zinc-500">No one-time income set</p>
            ) : (
              <div className="space-y-3">
                {oneTimeIncome.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium">{budget.category}</div>
                      <div className="text-xs text-zinc-500">
                        {budget.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-600">
                        ${budget.amount.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEdit(budget)}
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
                        onClick={() => handleDelete(budget.id)}
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
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-emerald-600">
                  $
                  {oneTimeIncome
                    .reduce((s, b) => s + b.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBudget ? "Edit Budget" : "Add Budget"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
              {error}
            </div>
          )}
          <Select
            label="Budget Type"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as
                  | "monthly"
                  | "oneTimeExpense"
                  | "oneTimeIncome",
              })
            }
            options={[
              { value: "monthly", label: "Monthly (Recurring)" },
              { value: "oneTimeExpense", label: "One-Time Expense" },
              { value: "oneTimeIncome", label: "One-Time Income" },
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
            step="0.01"
            required
          />
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            placeholder="e.g., Rent, Salaries, Equipment"
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
          {formData.type === "monthly" && (
            <Select
              label="Month"
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: parseInt(e.target.value) })
              }
              options={[
                { value: "1", label: "January" },
                { value: "2", label: "February" },
                { value: "3", label: "March" },
                { value: "4", label: "April" },
                { value: "5", label: "May" },
                { value: "6", label: "June" },
                { value: "7", label: "July" },
                { value: "8", label: "August" },
                { value: "9", label: "September" },
                { value: "10", label: "October" },
                { value: "11", label: "November" },
                { value: "12", label: "December" },
              ]}
            />
          )}
          <Select
            label="Year"
            value={formData.year}
            onChange={(e) =>
              setFormData({ ...formData, year: parseInt(e.target.value) })
            }
            options={[
              { value: "2024", label: "2024" },
              { value: "2025", label: "2025" },
              { value: "2026", label: "2026" },
              { value: "2027", label: "2027" },
              { value: "2028", label: "2028" },
            ]}
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
              {editingBudget ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
