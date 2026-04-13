"use client";

import { useEffect, useState } from "react";
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
import { BusinessTransaction, BusinessBudget } from "@/types";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<BusinessTransaction[]>([]);
  const [budgets, setBudgets] = useState<BusinessBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    totalInvestments: 0,
  });

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    async function fetchData() {
      try {
        const transQuery = query(
          collection(db, "businessTransactions"),
          where("userId", "==", userId),
          orderBy("date", "desc"),
          limit(10),
        );
        const transSnap = await getDocs(transQuery);
        const transData = transSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as BusinessTransaction[];
        setTransactions(transData);

        const income = transData
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transData
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);
        const savings = transData
          .filter((t) => t.type === "saving")
          .reduce((sum, t) => sum + t.amount, 0);
        const investments = transData
          .filter((t) => t.type === "investment")
          .reduce((sum, t) => sum + t.amount, 0);

        setStats({
          totalIncome: income,
          totalExpenses: expenses,
          totalSavings: savings,
          totalInvestments: investments,
        });

        const budgetQuery = query(
          collection(db, "businessBudgets"),
          where("userId", "==", userId),
          orderBy("year", "desc"),
        );
        const budgetSnap = await getDocs(budgetQuery);
        const budgetData = budgetSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as BusinessBudget[];
        setBudgets(budgetData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const yearBudgets = budgets.filter((b) => b.year === currentYear);
  const totalBudgeted = yearBudgets.reduce((sum, b) => {
    if (b.type === "monthly") return sum + b.amount * 12;
    return sum + b.amount;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Business Dashboard
        </h1>
        <Link
          href="/business/transactions"
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
            ${stats.totalIncome.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Total Expenses
          </div>
          <div className="text-2xl font-bold text-red-600">
            ${stats.totalExpenses.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Total Savings
          </div>
          <div className="text-2xl font-bold text-blue-600">
            ${stats.totalSavings.toLocaleString()}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Investments
          </div>
          <div className="text-2xl font-bold text-purple-600">
            ${stats.totalInvestments.toLocaleString()}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Budget Overview">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 dark:text-zinc-400">
                {currentYear} Budget
              </span>
              <span className="font-semibold">
                ${totalBudgeted.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 dark:text-zinc-400">
                Spent (YTD)
              </span>
              <span className="font-semibold">
                ${stats.totalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-zinc-600 dark:text-zinc-400">
                Remaining
              </span>
              <span
                className={`font-semibold ${totalBudgeted - stats.totalExpenses >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                ${(totalBudgeted - stats.totalExpenses).toLocaleString()}
              </span>
            </div>
          </div>
          <Link
            href="/business/budget"
            className="block mt-4 text-sm text-emerald-600 hover:text-emerald-700"
          >
            Manage Budgets →
          </Link>
        </Card>

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
            href="/business/transactions"
            className="block mt-4 text-sm text-emerald-600 hover:text-emerald-700"
          >
            View All →
          </Link>
        </Card>
      </div>
    </div>
  );
}
