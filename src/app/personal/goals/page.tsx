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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import { personalGoalSchema } from "@/lib/schemas";
import { PersonalGoal, InstallmentPlan } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/context/ToastContext";

export default function PersonalGoalsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { formatCurrency } = useSettings();
  const [goals, setGoals] = useState<PersonalGoal[]>([]);
  const [installments, setInstallments] = useState<InstallmentPlan[]>([]);
  const [savings, setSavings] = useState<{ id: string; name: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [installmentModalOpen, setInstallmentModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<PersonalGoal | null>(null);
  const [editingGoal, setEditingGoal] = useState<PersonalGoal | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    targetAmount: string;
    priority: "high" | "medium" | "low";
    deadline: string;
  }>({
    name: "",
    targetAmount: "",
    priority: "medium",
    deadline: "",
  });
  const [installmentForm, setInstallmentForm] = useState({
    amount: "",
    savingsId: "",
    frequency: "monthly" as "monthly" | "weekly" | "biweekly",
  });
  const [error, setError] = useState("");

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    const q = query(
      collection(db, "personalGoals"),
      where("userId", "==", user.uid),
    );
    const snap = await getDocs(q);
    setGoals(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        deadline: d.data().deadline?.toDate(),
      })) as PersonalGoal[],
    );

    const savingsQuery = query(
      collection(db, "personalSavings"),
      where("userId", "==", user.uid),
    );
    const savingsSnap = await getDocs(savingsQuery);
    setSavings(
      savingsSnap.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        amount: d.data().amount,
      })),
    );

    const installmentQuery = query(
      collection(db, "installmentPlans"),
      where("userId", "==", user.uid),
      where("linkedType", "==", "goal"),
    );
    const installmentSnap = await getDocs(installmentQuery);
    setInstallments(
      installmentSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        nextDueDate: d.data().nextDueDate?.toDate(),
        lastPaidDate: d.data().lastPaidDate?.toDate(),
      })) as InstallmentPlan[],
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const amount = parseFloat(formData.targetAmount);
    if (isNaN(amount) || amount < 0) {
      setError("Please enter a valid amount");
      setSaving(false);
      return;
    }
    const parsed = personalGoalSchema.safeParse({
      ...formData,
      targetAmount: amount,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      setSaving(false);
      return;
    }
    try {
      const data = {
        userId: user!.uid,
        name: formData.name,
        targetAmount: formData.targetAmount,
        priority: formData.priority,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
        currentAmount: editingGoal?.currentAmount || 0,
        completed: editingGoal?.completed || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      if (editingGoal) {
        await updateDoc(doc(db, "personalGoals", editingGoal.id), {
          ...data,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, "personalGoals"), data);
      }
      setModalOpen(false);
      resetForm();
      fetchGoals();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save goal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "personalGoals", deleteId));
    setDeleteId(null);
    fetchGoals();
    showToast("Goal deleted", "success");
  };
  const handleComplete = async (goal: PersonalGoal) => {
    await updateDoc(doc(db, "personalGoals", goal.id), {
      completed: !goal.completed,
      updatedAt: new Date(),
    });
    fetchGoals();
    showToast(goal.completed ? "Goal restored" : "Goal completed", "success");
  };

  const handleSetupInstallment = (goal: PersonalGoal) => {
    setSelectedGoal(goal);
    const existing = installments.find((i) => i.linkedId === goal.id);
    if (existing) {
      setInstallmentForm({
        amount: existing.amount.toString(),
        savingsId: existing.linkedSavingsId || "",
        frequency: existing.frequency,
      });
    } else {
      setInstallmentForm({
        amount: "",
        savingsId: "",
        frequency: "monthly",
      });
    }
    setInstallmentModalOpen(true);
  };

  const handleSaveInstallment = async () => {
    if (!selectedGoal) return;
    setSaving(true);
    try {
      const amount = parseFloat(installmentForm.amount);
      if (isNaN(amount) || amount <= 0) {
        setError("Please enter a valid amount");
        setSaving(false);
        return;
      }
      const existing = installments.find((i) => i.linkedId === selectedGoal.id);
      const nextDueDate = new Date();
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);

      if (existing) {
        await updateDoc(doc(db, "installmentPlans", existing.id), {
          amount,
          linkedSavingsId: installmentForm.savingsId || undefined,
          frequency: installmentForm.frequency,
          nextDueDate,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, "installmentPlans"), {
          userId: user!.uid,
          linkedType: "goal",
          linkedId: selectedGoal.id,
          amount,
          linkedSavingsId: installmentForm.savingsId || undefined,
          frequency: installmentForm.frequency,
          nextDueDate,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      setInstallmentModalOpen(false);
      setSelectedGoal(null);
      fetchGoals();
      showToast("Installment plan saved", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save installment");
    } finally {
      setSaving(false);
    }
  };
    showToast(goal.completed ? "Goal restored" : "Goal completed", "success");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      targetAmount: "",
      priority: "medium",
      deadline: "",
    });
    setEditingGoal(null);
  };
  const openEdit = (goal: PersonalGoal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      priority: goal.priority,
      deadline: goal.deadline ? goal.deadline.toISOString().split("T")[0] : "",
    });
    setModalOpen(true);
  };

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);
  const totalTarget = activeGoals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = activeGoals.reduce((s, g) => s + g.currentAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Goals
        </h1>
        <Button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          + Add Goal
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-zinc-500">Active Goals</div>
          <div className="text-2xl font-bold">{activeGoals.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Total Target</div>
          <div className="text-2xl font-bold text-emerald-600">
            {formatCurrency(totalTarget)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Total Saved</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalSaved)}
          </div>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Active Goals">
            {activeGoals.length === 0 ? (
              <p className="text-zinc-500">No active goals</p>
            ) : (
              <div className="space-y-4">
                {activeGoals.map((goal) => {
                  const progress =
                    goal.targetAmount > 0
                      ? (goal.currentAmount / goal.targetAmount) * 100
                      : 0;
                  return (
                    <div key={goal.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{goal.name}</div>
                          <div className="text-xs text-zinc-500">
                            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetupInstallment(goal)}
                            className="text-blue-400 hover:text-blue-600"
                            aria-label="Setup Installment"
                            title="Auto-save monthly"
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
                          <button
                            type="button"
                            onClick={() => openEdit(goal)}
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
                            onClick={() => handleComplete(goal)}
                            className="text-emerald-400 hover:text-emerald-600"
                            aria-label="Complete"
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
                            onClick={() => setDeleteId(goal.id)}
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
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500 mt-1">
                        <span>{progress.toFixed(0)}%</span>
                        {installments.find((i) => i.linkedId === goal.id) && (
                          <span className="text-blue-500">Auto: {formatCurrency(installments.find((i) => i.linkedId === goal.id)?.amount || 0)}/{installments.find((i) => i.linkedId === goal.id)?.frequency}</span>
                        )}
                      </div>
                        <span
                          className={
                            goal.priority === "high"
                              ? "text-red-500"
                              : goal.priority === "low"
                                ? "text-zinc-400"
                                : "text-yellow-500"
                          }
                        >
                          {goal.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card title="Completed Goals">
            {completedGoals.length === 0 ? (
              <p className="text-zinc-500">No completed goals</p>
            ) : (
              <div className="space-y-3">
                {completedGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium line-through">
                        {goal.name}
                      </div>
                      <div className="text-xs text-emerald-500">
                        {formatCurrency(goal.currentAmount)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleComplete(goal)}
                        className="text-zinc-400 hover:text-zinc-600"
                        aria-label="Undo"
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
                      <button
                        type="button"
                        onClick={() => setDeleteId(goal.id)}
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
        title={editingGoal ? "Edit Goal" : "Add Goal"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
              {error}
            </div>
          )}
          <Input
            label="Goal Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Emergency Fund, Vacation"
            required
          />
          <Input
            label="Target Amount"
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
            required
          />
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as "high" | "medium" | "low",
              })
            }
            options={[
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
          />
          <Input
            label="Deadline (Optional)"
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
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
              {editingGoal ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>

      </Modal>

      <Modal
        isOpen={installmentModalOpen}
        onClose={() => setInstallmentModalOpen(false)}
        title={selectedGoal ? `Setup Auto-Save for ${selectedGoal.name}` : "Setup Auto-Save"}
      >
        <form onSubmit={handleSaveInstallment} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
              {error}
            </div>
          )}
          <Input
            label="Monthly Allocation Amount"
            type="number"
            value={installmentForm.amount}
            onChange={(e) => setInstallmentForm({ ...installmentForm, amount: e.target.value })}
            placeholder="0.00"
            min="0"
            required
          />
          <Select
            label="Save to Account (Optional)"
            value={installmentForm.savingsId}
            onChange={(e) => setInstallmentForm({ ...installmentForm, savingsId: e.target.value })}
            options={[
              { value: "", label: "Select a savings account" },
              ...savings.map((s) => ({ value: s.id, label: `${s.name} (${formatCurrency(s.amount)})` })),
            ]}
          />
          <Select
            label="Frequency"
            value={installmentForm.frequency}
            onChange={(e) => setInstallmentForm({ ...installmentForm, frequency: e.target.value as "monthly" | "weekly" | "biweekly" })}
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "weekly", label: "Weekly" },
              { value: "biweekly", label: "Bi-Weekly" },
            ]}
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setInstallmentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={saving}>
              Save Installment
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Goal"
        message="Are you sure you want to delete this goal?"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
