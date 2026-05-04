"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import { personalTransactionSchema } from "@/lib/schemas";
import {
  PersonalTransaction,
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

export default function PersonalTransactionsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { formatCurrency } = useSettings();
  const [transactions, setTransactions] = useState<PersonalTransaction[]>([]);
  const [currentAccount, setCurrentAccount] = useState<CurrentAccount | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [formData, setFormData] = useState<{
    type: "income" | "expense";
    amount: string;
    category: PersonalTransactionCategory;
    description: string;
    date: Date;
  }>({
    type: "expense",
    amount: "",
    category: "needs",
    description: "",
    date: new Date(),
  });
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      const transQ = query(
        collection(db, "personalTransactions"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
      );
      const transSnap = await getDocs(transQ);
      setTransactions(
        transSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          date: d.data().date.toDate(),
        })) as PersonalTransaction[],
      );

      const accountDoc = await getDoc(doc(db, "currentAccounts", user.uid));
      if (accountDoc.exists()) {
        setCurrentAccount({
          id: accountDoc.id,
          ...accountDoc.data(),
          lastUpdated: accountDoc.data().lastUpdated?.toDate(),
        } as CurrentAccount);
      } else {
        const initialAccount: CurrentAccount = {
          id: user.uid,
          userId: user.uid,
          balance: 0,
          totalIncome: 0,
          totalExpenses: 0,
          totalSavings: 0,
          totalBorrowed: 0,
          lastUpdated: new Date(),
        };
        await setDoc(doc(db, "currentAccounts", user.uid), initialAccount);
        setCurrentAccount(initialAccount);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
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
    const amount = parseFloat(formData.amount);

    if (Number.isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (
      formData.type === "expense" &&
      currentAccount &&
      amount > currentAccount.balance
    ) {
      setError(
        `Insufficient balance. Your current balance is ${formatCurrency(currentAccount.balance)}`,
      );
      return;
    }

    setSaving(true);

    try {
      const parsed = personalTransactionSchema.safeParse({
        ...formData,
        amount,
      });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Validation failed");
        setSaving(false);
        return;
      }

      await runTransaction(db, async (transaction) => {
        const accountRef = doc(db, "currentAccounts", user?.uid || "");
        const accountDoc = await transaction.get(accountRef);

        if (!accountDoc.exists()) {
          throw new Error("Account not found");
        }

        const accountData = accountDoc.data() as CurrentAccount;
        let newBalance = accountData.balance;
        let newTotalIncome = accountData.totalIncome;
        let newTotalExpenses = accountData.totalExpenses;

        if (formData.type === "income") {
          newBalance += amount;
          newTotalIncome += amount;
        } else {
          if (amount > newBalance) {
            throw new Error("Insufficient balance");
          }
          newBalance -= amount;
          newTotalExpenses += amount;
        }

        transaction.update(accountRef, {
          balance: newBalance,
          totalIncome: newTotalIncome,
          totalExpenses: newTotalExpenses,
          lastUpdated: new Date(),
        });

        transaction.set(doc(collection(db, "personalTransactions")), {
          userId: user?.uid || "",
          type: formData.type,
          amount,
          category: formData.category,
          description: formData.description || "",
          date: formData.date,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      setModalOpen(false);
      resetForm();
      fetchTransactions();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to save transaction",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "personalTransactions", deleteId));
    setDeleteId(null);
    fetchTransactions();
    showToast("Transaction deleted", "success");
  };

  const resetForm = () =>
    setFormData({
      type: "expense",
      amount: "",
      category: "needs",
      description: "",
      date: new Date(),
    });

  const filtered =
    filterCategory === "all"
      ? transactions.filter((t) => !t.archived)
      : transactions.filter(
          (t) => !t.archived && t.category === filterCategory,
        );
  const totalIncome = transactions
    .filter((t) => t.type === "income" && !t.archived)
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense" && !t.archived)
    .reduce((s, t) => s + t.amount, 0);

  const byCategory = categories.map((cat) => ({
    ...cat,
    amount: transactions
      .filter(
        (t) => !t.archived && t.category === cat.value && t.type === "expense",
      )
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

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Current Balance
          </div>
          <div
            className={`text-2xl font-bold ${(currentAccount?.balance || 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            {formatCurrency(currentAccount?.balance || 0)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Total Income
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {formatCurrency(totalIncome)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Total Expenses
          </div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenses)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Net</div>
<div
                        className={`font-semibold ${trans.type === "income" ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {trans.type === "income" ? "+" : "-"}
                        {formatCurrency(trans.amount)}
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
                     {formatCurrency(cat.amount)}
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
              setFormData({ ...formData, amount: e.target.value })
            }
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
          {formData.type === "expense" && currentAccount && (
            <p className="text-xs text-zinc-500">
              Available balance: {formatCurrency(currentAccount.balance)}
            </p>
          )}
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

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This will not affect your balance."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
