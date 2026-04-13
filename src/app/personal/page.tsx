"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  PersonalTransaction,
  PersonalGoal,
  PersonalSavings,
  Debt,
} from "@/types";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function PersonalDashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PersonalTransaction[]>([]);
  const [goals, setGoals] = useState<PersonalGoal[]>([]);
  const [savings, setSavings] = useState<PersonalSavings[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const transQuery = query(
        collection(db, "personalTransactions"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
        limit(10),
      );
      const transSnap = await getDocs(transQuery);
      setTransactions(
        transSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          date: d.data().date.toDate(),
        })) as PersonalTransaction[],
      );

      const goalsQuery = query(
        collection(db, "personalGoals"),
        where("userId", "==", user.uid),
      );
      const goalsSnap = await getDocs(goalsQuery);
      setGoals(
        goalsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
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
          ...d.data(),
        })) as PersonalSavings[],
      );

      const debtsQuery = query(
        collection(db, "debts"),
        where("userId", "==", user.uid),
        where("cleared", "==", false),
      );
      const debtsSnap = await getDocs(debtsQuery);
      setDebts(
        debtsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Debt[],
      );
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const projectedSavings = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? (projectedSavings / totalIncome) * 100 : 0;

  const totalOwed = debts
    .filter((d) => d.type === "owed_to")
    .reduce((s, d) => s + d.amount, 0);
  const totalOwing = debts
    .filter((d) => d.type === "owed_by")
    .reduce((s, d) => s + d.amount, 0);
  const totalSavings = savings.reduce((s, svs) => s + svs.amount, 0);
  const emergencyFundTarget = totalIncome * 3;
  const emergencyFundStatus =
    totalSavings >= emergencyFundTarget
      ? "adequate"
      : totalSavings > 0
        ? "insufficient"
        : "none";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Personal Dashboard
        </h1>
        <Link
          href="/personal/transactions"
          className="text-emerald-600 hover:text-emerald-700"
        >
          + Add Transaction
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
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
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Projected Savings
          </div>
          <div
            className={`text-2xl font-bold ${projectedSavings >= 0 ? "text-blue-600" : "text-red-600"}`}
          >
            ${projectedSavings.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Savings Rate
          </div>
          <div
            className={`text-2xl font-bold ${savingsRate >= 20 ? "text-emerald-600" : savingsRate >= 10 ? "text-yellow-600" : "text-red-600"}`}
          >
            {savingsRate.toFixed(1)}%
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Financial Position">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">You Owe</span>
              <span className="font-semibold text-red-600">
                ${totalOwed.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Owed to You
              </span>
              <span className="font-semibold text-emerald-600">
                ${totalOwing.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="text-zinc-600 dark:text-zinc-400">Net</span>
              <span
                className={`font-semibold ${totalOwing - totalOwed >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                ${(totalOwing - totalOwed).toLocaleString()}
              </span>
            </div>
          </div>
          <Link
            href="/personal/debts"
            className="block mt-4 text-sm text-emerald-600 hover:text-emerald-700"
          >
            Manage Debts →
          </Link>
        </Card>

        <Card title="Savings">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Total Savings
              </span>
              <span className="font-semibold text-blue-600">
                ${totalSavings.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Emergency Fund Target
              </span>
              <span className="font-semibold">
                ${emergencyFundTarget.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="text-zinc-600 dark:text-zinc-400">Status</span>
              <span
                className={`font-semibold ${emergencyFundStatus === "adequate" ? "text-emerald-600" : emergencyFundStatus === "insufficient" ? "text-yellow-600" : "text-red-600"}`}
              >
                {emergencyFundStatus === "adequate"
                  ? "Adequate"
                  : emergencyFundStatus === "insufficient"
                    ? "Building"
                    : "None"}
              </span>
            </div>
          </div>
          <Link
            href="/personal/savings"
            className="block mt-4 text-sm text-emerald-600 hover:text-emerald-700"
          >
            Manage Savings →
          </Link>
        </Card>

        <Card title="Goals Progress">
          {goals.length === 0 ? (
            <p className="text-zinc-500">No goals set</p>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 3).map((goal) => {
                const progress =
                  goal.targetAmount > 0
                    ? (goal.currentAmount / goal.targetAmount) * 100
                    : 0;
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm">
                      <span>{goal.name}</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 mt-1">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Link
            href="/personal/goals"
            className="block mt-4 text-sm text-emerald-600 hover:text-emerald-700"
          >
            Manage Goals →
          </Link>
        </Card>
      </div>

      <Card title="Recent Transactions">
        {transactions.length === 0 ? (
          <p className="text-zinc-500">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((trans) => (
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
                <div
                  className={`font-semibold ${trans.type === "income" ? "text-emerald-600" : "text-red-600"}`}
                >
                  {trans.type === "income" ? "+" : "-"}$
                  {trans.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
        <Link
          href="/personal/transactions"
          className="block mt-4 text-sm text-emerald-600 hover:text-emerald-700"
        >
          View All →
        </Link>
      </Card>
    </div>
  );
}
