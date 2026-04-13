import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personal Finance - Argent Finance Documentation",
  description:
    "Learn how to manage your personal finances with Argent. Track transactions, set budgets, manage savings goals, and handle debts.",
  keywords: [
    "personal finance management",
    "track expenses",
    "budget planning",
    "savings goals",
    "debt management",
    "personal budget",
  ],
};

export default function PersonalFinancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Personal Finance Management
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">
          Argent provides comprehensive tools to help you manage your personal
          finances effectively. This guide covers all the features available for
          personal accounts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/docs/personal-finance/transactions"
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Transactions
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Record income and expenses, categorize spending, and view
            transaction history.
          </p>
          <span className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            Learn more →
          </span>
        </Link>

        <Link
          href="/docs/personal-finance/budget"
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Budget
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Set monthly budgets and track your spending against your financial
            goals.
          </p>
          <span className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            Learn more →
          </span>
        </Link>

        <Link
          href="/docs/personal-finance/goals"
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Goals
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Set and track financial goals like buying a car, vacation, or
            emergency fund.
          </p>
          <span className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            Learn more →
          </span>
        </Link>

        <Link
          href="/docs/personal-finance/savings"
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Savings
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Create savings accounts for different purposes and track your
            progress.
          </p>
          <span className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            Learn more →
          </span>
        </Link>

        <Link
          href="/docs/personal-finance/debts"
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Debts
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Track money you owe and money owed to you, and manage debt payments.
          </p>
          <span className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            Learn more →
          </span>
        </Link>
      </div>

      <div className="bg-zinc-100 dark:bg-zinc-700/50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
          Dashboard Overview
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Your Personal Dashboard provides a quick overview of your financial
          situation:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
          <li>
            <strong>Total Income:</strong> Sum of all income transactions
          </li>
          <li>
            <strong>Total Expenses:</strong> Sum of all expense transactions
          </li>
          <li>
            <strong>Projected Savings:</strong> Income minus expenses
          </li>
          <li>
            <strong>Savings Rate:</strong> Percentage of income saved
          </li>
          <li>
            <strong>Financial Position:</strong> Debts owed vs debts to collect
          </li>
          <li>
            <strong>Emergency Fund Status:</strong> Progress toward 3-month
            emergency fund
          </li>
        </ul>
      </div>

      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <p>
          Argent Finance is a product by{" "}
          <a
            href="https://ubunifu.techinika.co.rw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700"
          >
            Ubunifu Labs
          </a>
        </p>
      </div>
    </div>
  );
}
