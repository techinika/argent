"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { personalBudgetItemSchema } from "@/lib/schemas";
import {
  PersonalBudgetItem,
  PersonalTransactionCategory,
  CurrentAccount,
} from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/context/ToastContext";

const categories: { value: PersonalTransactionCategory; label: string }[] = [
  { value: "necessities", label: "Necessities" },
  { value: "debts", label: "Debt Payments" },
  { value: "needs", label: "Needs" },
  { value: "emergencies", label: "Emergencies" },
  { value: "income", label: "Income" },
  { value: "other", label: "Other" },
];

export default function PersonalBudgetPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<PersonalBudgetItem[]>([]);
  const [currentAccount, setCurrentAccount] = useState<CurrentAccount | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PersonalBudgetItem | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    name: "",
    estimatedCost: 0,
    category: "needs" as PersonalTransactionCategory,
    isEssential: false,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    const q = query(
      collection(db, "personalBudgetItems"),
      where("userId", "==", user.uid),
    );
    const snap = await getDocs(q);
    setItems(
      snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PersonalBudgetItem[],
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
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const parsed = personalBudgetItemSchema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      setSaving(false);
      return;
    }
    try {
      const data = {
        userId: user!.uid,
        name: formData.name,
        estimatedCost: formData.estimatedCost,
        category: formData.category,
        isEssential: formData.isEssential,
        month: formData.month,
        year: formData.year,
        completed: editingItem?.completed || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      if (editingItem) {
        await updateDoc(doc(db, "personalBudgetItems", editingItem.id), {
          ...data,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, "personalBudgetItems"), data);
      }
      setModalOpen(false);
      resetForm();
      fetchItems();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "personalBudgetItems", deleteId));
    setDeleteId(null);
    fetchItems();
    showToast("Item deleted", "success");
  };
  const handleComplete = async (item: PersonalBudgetItem) => {
    const now = new Date();
    const isCompleting = !item.completed;

    try {
      await runTransaction(db, async (transaction) => {
        const accountRef = doc(db, "currentAccounts", user!.uid);
        const accountDoc = await transaction.get(accountRef);

        if (!accountDoc.exists()) {
          throw new Error("Account not found");
        }

        const accountData = accountDoc.data() as CurrentAccount;

        if (isCompleting) {
          if (item.estimatedCost > accountData.balance) {
            throw new Error("Insufficient balance to complete this item");
          }

          transaction.update(accountRef, {
            balance: accountData.balance - item.estimatedCost,
            totalExpenses: accountData.totalExpenses + item.estimatedCost,
            lastUpdated: now,
          });

          transaction.set(doc(collection(db, "personalTransactions")), {
            userId: user!.uid,
            type: "expense",
            amount: item.estimatedCost,
            category: item.category,
            description: `Budget: ${item.name}`,
            date: now,
            archived: false,
            createdAt: now,
            updatedAt: now,
          });
        } else {
          transaction.update(accountRef, {
            balance: accountData.balance + item.estimatedCost,
            totalExpenses: accountData.totalExpenses - item.estimatedCost,
            lastUpdated: now,
          });

          const transQ = query(
            collection(db, "personalTransactions"),
            where("description", "==", `Budget: ${item.name}`),
            where("userId", "==", user!.uid),
          );
          const transSnap = await getDocs(transQ);
          for (const t of transSnap.docs) {
            if (!t.data().archived) {
              transaction.update(doc(db, "personalTransactions", t.id), {
                archived: true,
                updatedAt: now,
              });
              break;
            }
          }
        }

        transaction.update(doc(db, "personalBudgetItems", item.id), {
          completed: isCompleting,
          updatedAt: now,
        });
      });

      fetchItems();
      showToast(
        isCompleting
          ? "Item completed, expense recorded"
          : "Item restored, expense archived",
        "success",
      );
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to complete item",
        "error",
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      estimatedCost: 0,
      category: "needs",
      isEssential: false,
      month: selectedMonth,
      year: selectedYear,
    });
    setEditingItem(null);
  };
  const openEdit = (item: PersonalBudgetItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      estimatedCost: item.estimatedCost,
      category: item.category,
      isEssential: item.isEssential,
      month: item.month,
      year: item.year,
    });
    setModalOpen(true);
  };

  const monthItems = items.filter(
    (i) => i.month === selectedMonth && i.year === selectedYear,
  );
  const essentialTotal = monthItems
    .filter((i) => i.isEssential)
    .reduce((s, i) => s + i.estimatedCost, 0);
  const nonEssentialTotal = monthItems
    .filter((i) => !i.isEssential)
    .reduce((s, i) => s + i.estimatedCost, 0);
  const totalPlanned = essentialTotal + nonEssentialTotal;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Planned Expenses
        </h1>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800"
          >
            {[2024, 2025, 2026, 2027, 2028].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <Button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
          >
            + Add Item
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-zinc-500">Essential</div>
          <div className="text-2xl font-bold text-red-600">
            ${essentialTotal.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Non-Essential</div>
          <div className="text-2xl font-bold text-yellow-600">
            ${nonEssentialTotal.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Total Planned</div>
          <div className="text-2xl font-bold">
            ${totalPlanned.toLocaleString()}
          </div>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            title={`${months[selectedMonth - 1]} ${selectedYear} - Essential`}
          >
            {monthItems.filter((i) => i.isEssential).length === 0 ? (
              <p className="text-zinc-500">No essential items</p>
            ) : (
              <div className="space-y-3">
                {monthItems
                  .filter((i) => i.isEssential)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleComplete(item)}
                          className={`w-4 h-4 rounded border ${item.completed ? "bg-emerald-500 border-emerald-500" : "border-zinc-300"}`}
                        >
                          {item.completed && (
                            <svg
                              className="w-4 h-4 text-white"
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
                          )}
                        </button>
                        <span
                          className={
                            item.completed ? "line-through text-zinc-400" : ""
                          }
                        >
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          ${item.estimatedCost.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
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
                          onClick={() => setDeleteId(item.id)}
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

          <Card
            title={`${months[selectedMonth - 1]} ${selectedYear} - Non-Essential`}
          >
            {monthItems.filter((i) => !i.isEssential).length === 0 ? (
              <p className="text-zinc-500">No non-essential items</p>
            ) : (
              <div className="space-y-3">
                {monthItems
                  .filter((i) => !i.isEssential)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleComplete(item)}
                          className={`w-4 h-4 rounded border ${item.completed ? "bg-emerald-500 border-emerald-500" : "border-zinc-300"}`}
                        >
                          {item.completed && (
                            <svg
                              className="w-4 h-4 text-white"
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
                          )}
                        </button>
                        <span
                          className={
                            item.completed ? "line-through text-zinc-400" : ""
                          }
                        >
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          ${item.estimatedCost.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
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
                          onClick={() => setDeleteId(item.id)}
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
        title={editingItem ? "Edit Item" : "Add Item"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
              {error}
            </div>
          )}
          <Input
            label="Item Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., New Phone, Dinner Out"
            required
          />
          <Input
            label="Estimated Cost"
            type="number"
            value={formData.estimatedCost}
            onChange={(e) =>
              setFormData({
                ...formData,
                estimatedCost: parseFloat(e.target.value) || 0,
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isEssential"
              checked={formData.isEssential}
              onChange={(e) =>
                setFormData({ ...formData, isEssential: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="isEssential" className="text-sm">
              Essential (Must have)
            </label>
          </div>
          <Select
            label="Month"
            value={formData.month}
            onChange={(e) =>
              setFormData({ ...formData, month: parseInt(e.target.value) })
            }
            options={months.map((m, i) => ({ value: String(i + 1), label: m }))}
          />
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
              {editingItem ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this budget item?"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
