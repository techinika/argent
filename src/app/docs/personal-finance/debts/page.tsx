import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personal Debts - Argent Finance Documentation",
  description:
    "Learn how to track and manage debts in Argent. Track money you owe and money owed to you.",
  keywords: [
    "debt tracking",
    "manage debts",
    "money owed",
    "credit tracking",
    "loan tracking",
  ],
};

export default function PersonalDebtsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Personal Debts
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Track money you owe to others and money others owe to you.
          </p>
        </div>
        <Link
          href="/docs/personal-finance"
          className="text-emerald-600 hover:text-emerald-700 text-sm"
        >
          ← Back to Personal Finance
        </Link>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Adding a Debt
          </h3>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
            <p className="text-zinc-600 dark:text-zinc-400">
              To add a new debt record:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Navigate to the Debts page under Personal</li>
              <li>Click the "+ Add Debt" button</li>
              <li>Select the debt type (Money Owed to You or Money You Owe)</li>
              <li>Enter the person or company name</li>
              <li>Enter the amount</li>
              <li>Add an optional description or note</li>
              <li>Click "Save" to record the debt</li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Debt Types
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
              <h4 className="font-medium text-emerald-800 dark:text-emerald-300">
                Money Owed to You
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                Someone owes you money. This could be a personal loan you gave,
                a shared expense they need to repay, or any other situation
                where you are owed money.
              </p>
            </div>
            <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h4 className="font-medium text-red-800 dark:text-red-300">
                Money You Owe
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                You owe money to someone. This could be a loan from family or
                friends, a credit card balance, or any other debt you need to
                repay.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Recording Payments
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            When you make a payment toward a debt:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Find the debt on your Debts page</li>
            <li>Click the "Record Payment" button</li>
            <li>Enter the payment amount</li>
            <li>The remaining balance will update automatically</li>
            <li>Once paid in full, mark the debt as cleared</li>
          </ol>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Financial Position Overview
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            The Personal Dashboard shows your overall debt position:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>You Owe:</strong> Total of all debts you need to pay
            </li>
            <li>
              <strong>Owed to You:</strong> Total of all money owed to you
            </li>
            <li>
              <strong>Net Position:</strong> The difference between what you owe
              and what is owed to you
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Clearing a Debt
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            When a debt is fully paid, you can mark it as cleared. This will
            archive the debt but keep it in your records for reference. You can
            view cleared debts by toggling the "Show Cleared" option.
          </p>
        </section>
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
