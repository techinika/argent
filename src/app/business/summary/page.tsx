"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import { BusinessTransaction, BusinessBudget } from "@/types";
import { Card } from "@/components/ui/Card";

interface MonthlyData {
  month: number;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
}

export default function BusinessSummaryPage() {
  const { user } = useAuth();
  const { formatCurrency } = useSettings();
  const [transactions, setTransactions] = useState<BusinessTransaction[]>([]);
  const [budgets, setBudgets] = useState<BusinessBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const transQuery = query(
        collection(db, "businessTransactions"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
      );
      const transSnap = await getDocs(transQuery);
      const transData = transSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as BusinessTransaction[];
      setTransactions(transData);

      const budgetQuery = query(
        collection(db, "businessBudgets"),
        where("userId", "==", user.uid),
        orderBy("year", "desc"),
      );
      const budgetSnap = await getDocs(budgetQuery);
      const budgetData = budgetSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BusinessBudget[];
      setBudgets(budgetData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const yearTransactions = transactions.filter(
    (t) => t.date.getFullYear() === selectedYear,
  );
  const yearBudgets = budgets.filter((b) => b.year === selectedYear);

  const totalBudgeted = yearBudgets.reduce((sum, b) => {
    if (b.type === "monthly") return sum + b.amount * 12;
    return sum + b.amount;
  }, 0);

  const totalIncome = yearTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = yearTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = yearTransactions
    .filter((t) => t.type === "saving")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInvestments = yearTransactions
    .filter((t) => t.type === "investment")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyData: MonthlyData[] = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthTrans = yearTransactions.filter(
      (t) => t.date.getMonth() + 1 === month,
    );
    return {
      month,
      income: monthTrans
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
      expenses: monthTrans
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
      savings: monthTrans
        .filter((t) => t.type === "saving")
        .reduce((s, t) => s + t.amount, 0),
      investments: monthTrans
        .filter((t) => t.type === "investment")
        .reduce((s, t) => s + t.amount, 0),
    };
  });

  const getBudgetStatus = (month: number) => {
    const monthBudgets = yearBudgets.filter(
      (b) =>
        (b.type === "monthly" || b.month === month) && b.year === selectedYear,
    );
    const budgeted = monthBudgets.reduce(
      (sum, b) => (b.type === "monthly" ? sum + b.amount : sum + b.amount),
      0,
    );
    const spent = monthlyData[month - 1].expenses;
    const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;

    if (percentage > 100)
      return { status: "over_budget", color: "text-red-600", bg: "bg-red-100" };
    if (percentage > 80)
      return {
        status: "warning",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    return {
      status: "on_track",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    };
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

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
          Budget Summary
        </h1>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800"
        >
          {[2024, 2025, 2026, 2027, 2028].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Total Budgeted
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(totalBudgeted)}
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
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Net Profit
          </div>
          <div
            className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            {formatCurrency(totalIncome - totalExpenses)}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Monthly Breakdown">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Month</th>
                  <th className="text-right py-2">Income</th>
                  <th className="text-right py-2">Expenses</th>
                  <th className="text-right py-2">Savings</th>
                  <th className="text-right py-2">Investments</th>
                  <th className="text-right py-2">Net</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, i) => {
                  const net = data.income - data.expenses;
                  return (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2">{months[i]}</td>
                      <td className="text-right text-emerald-600">
                        {formatCurrency(data.income)}
                      </td>
                      <td className="text-right text-red-600">
                        {formatCurrency(data.expenses)}
                      </td>
                      <td className="text-right text-blue-600">
                        {formatCurrency(data.savings)}
                      </td>
                      <td className="text-right text-purple-600">
                        {formatCurrency(data.investments)}
                      </td>
                      <td
                        className={`text-right font-semibold ${net >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {formatCurrency(net)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td className="py-2">Total</td>
                  <td className="text-right text-emerald-600">
                    {formatCurrency(totalIncome)}
                  </td>
                  <td className="text-right text-red-600">
                    {formatCurrency(totalExpenses)}
                  </td>
                  <td className="text-right text-blue-600">
                    {formatCurrency(totalSavings)}
                  </td>
                  <td className="text-right text-purple-600">
                    {formatCurrency(totalInvestments)}
                  </td>
                  <td
                    className={`text-right ${totalIncome - totalExpenses >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {formatCurrency(totalIncome - totalExpenses)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        <Card title="Budget vs Actual">
          <div className="space-y-4">
            {yearBudgets
              .filter((b) => b.type === "monthly")
              .slice(0, 6)
              .map((budget, i) => {
                const actual = monthlyData[budget.month! - 1].expenses;
                const percentage =
                  budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
                const status = getBudgetStatus(budget.month!);
                return (
                  <div key={budget.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        {months[budget.month! - 1]} - {budget.category}
                      </span>
                      <span className={status.color}>
                        {percentage.toFixed(0)}% ({formatCurrency(actual)}/
                        {formatCurrency(budget.amount)})
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${status.bg} ${status.color.replace("text-", "bg-")}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      </div>

      <Card title="Performance Analysis">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2">Profit Margin</h4>
            <p className="text-3xl font-bold text-emerald-600">
              {totalIncome > 0
                ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(
                    1,
                  )
                : 0}
              %
            </p>
            <p className="text-sm text-zinc-500">
              {totalIncome - totalExpenses >= 0
                ? "Profitable"
                : "Operating at a loss"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Savings Rate</h4>
            <p className="text-3xl font-bold text-blue-600">
              {totalIncome > 0
                ? ((totalSavings / totalIncome) * 100).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-sm text-zinc-500">
              {totalSavings > 0 ? "Building reserves" : "No savings recorded"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Investment Activity</h4>
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(totalInvestments)}
            </p>
            <p className="text-sm text-zinc-500">
              {totalInvestments > 0 ? "Investing in growth" : "No investments"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
