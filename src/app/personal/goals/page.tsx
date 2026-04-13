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
import { personalGoalSchema } from "@/lib/schemas";
import { PersonalGoal } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";

export default function PersonalGoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<PersonalGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<PersonalGoal | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    targetAmount: number;
    priority: "high" | "medium" | "low";
    deadline: string;
  }>({
    name: "",
    targetAmount: 0,
    priority: "medium",
    deadline: "",
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
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const parsed = personalGoalSchema.safeParse(formData);
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this goal?")) return;
    await deleteDoc(doc(db, "personalGoals", id));
    fetchGoals();
  };
  const handleComplete = async (goal: PersonalGoal) => {
    await updateDoc(doc(db, "personalGoals", goal.id), {
      completed: !goal.completed,
      updatedAt: new Date(),
    });
    fetchGoals();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      targetAmount: 0,
      priority: "medium",
      deadline: "",
    });
    setEditingGoal(null);
  };
  const openEdit = (goal: PersonalGoal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
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
            ${totalTarget.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Total Saved</div>
          <div className="text-2xl font-bold text-blue-600">
            ${totalSaved.toLocaleString()}
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
                            ${goal.currentAmount.toLocaleString()} / $
                            {goal.targetAmount.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
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
                            onClick={() => handleDelete(goal.id)}
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
                        ${goal.currentAmount.toLocaleString()}
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
                        onClick={() => handleDelete(goal.id)}
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
                targetAmount: parseFloat(e.target.value) || 0,
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
    </div>
  );
}
