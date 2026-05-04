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
import { useSettings } from "@/hooks/useSettings";
import { BusinessTransaction, BusinessBudget } from "@/types";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function BusinessDashboard() {
  const { user } = useAuth();
  const { formatCurrency, formatDate } = useSettings();
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
          limit(50),
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
  const currentMonth = new Date().getMonth();
  const yearBudgets = budgets.filter((b) => b.year === currentYear);
  const totalBudgeted = yearBudgets.reduce((sum, b) => {
    if (b.type === "monthly") return sum + b.amount * 12;
    return sum + b.amount;
  }, 0);

  const monthlyTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncomeByCategory = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const monthlyBudget = yearBudgets
    .filter((b) => b.type === "monthly")
    .reduce((sum, b) => sum + b.amount, 0);

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
            {formatCurrency(stats.totalIncome)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Total Expenses
          </div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(stats.totalExpenses)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Total Savings
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(stats.totalSavings)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Investments
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(stats.totalInvestments)}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card title={`This Month's Spending (${new Date().toLocaleString('default', { month: 'long' })})`}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Monthly Budget</span>
              <span className="font-semibold">{formatCurrency(monthlyBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Spent So Far</span>
              <span className={`font-semibold ${monthlyExpenses > monthlyBudget ? "text-red-600" : "text-emerald-600"}`}>
                {formatCurrency(monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="text-zinc-600 dark:text-zinc-400">Remaining</span>
              <span className={`font-semibold ${monthlyBudget - monthlyExpenses >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {formatCurrency(monthlyBudget - monthlyExpenses)}
              </span>
            </div>
          </div>
          <Link href="/business/budget" className="block mt-4 text-sm text-emerald-600 hover:text-emerald-700">
            Manage Budgets →
          </Link>
        </Card>

        <Card title={`Expected Income This Month (${new Date().toLocaleString('default', { month: 'long' })})`}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Projected</span>
              <span className="font-semibold text-emerald-600">{formatCurrency(monthlyIncome)}</span>
            </div>
            {Object.entries(monthlyIncomeByCategory).length === 0 ? (
              <p className="text-zinc-500 text-sm">No income yet this month</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(monthlyIncomeByCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">{category}</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link href="/business/transactions" className="block mt-4 text-sm text-emerald-600 hover:text-emerald-700">
            View Transactions →
          </Link>
        </Card>

        <Card title="Budget Overview">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 dark:text-zinc-400">
                {currentYear} Budget
              </span>
              <span className="font-semibold">
                {formatCurrency(totalBudgeted)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 dark:text-zinc-400">
                Spent (YTD)
              </span>
              <span className="font-semibold">
                {formatCurrency(stats.totalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-zinc-600 dark:text-zinc-400">
                Remaining
              </span>
              <span
                className={`font-semibold ${totalBudgeted - stats.totalExpenses >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {formatCurrency(totalBudgeted - stats.totalExpenses)}
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
                    {formatDate(trans.date)}
                  </div>
                </div>
                <div
                  className={`font-semibold ${trans.type === "income" ? "text-emerald-600" : "text-red-600"}`}
                >
                  {trans.type === "income" ? "+" : "-"}
                  {formatCurrency(trans.amount)}
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
  );
}
