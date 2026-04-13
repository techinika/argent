import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personal Savings - Argent Finance Documentation",
  description:
    "Learn how to manage and track your personal savings accounts in Argent.",
  keywords: [
    "personal savings",
    "savings account",
    "money storage",
    "savings tracking",
    "emergency fund",
  ],
};

export default function PersonalSavingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Personal Savings
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Create and manage multiple savings accounts for different purposes.
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
            Creating a Savings Account
          </h3>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
            <p className="text-zinc-600 dark:text-zinc-400">
              To create a new savings account:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Navigate to the Savings page under Personal</li>
              <li>Click the "+ Add Savings" button</li>
              <li>
                Enter a name for your savings (e.g., "Emergency Fund",
                "Vacation")
              </li>
              <li>Enter your initial deposit amount</li>
              <li>Choose a color for visual identification</li>
              <li>Add an optional description</li>
              <li>Click "Save" to create your savings account</li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Managing Savings
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Your savings accounts allow you to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Track multiple goals:</strong> Separate savings for
              different purposes
            </li>
            <li>
              <strong>Add deposits:</strong> Transfer money into your savings
            </li>
            <li>
              <strong>Withdraw:</strong> Take money out when needed
            </li>
            <li>
              <strong>Monitor progress:</strong> See how much you have saved
              over time
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Depositing and Withdrawing
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
              <h4 className="font-medium text-emerald-800 dark:text-emerald-300">
                Adding Money
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                Click "Add" next to a savings account and enter the amount you
                want to deposit. Your balance will increase immediately.
              </p>
            </div>
            <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h4 className="font-medium text-red-800 dark:text-red-300">
                Withdrawing Money
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                Click "Withdraw" next to a savings account and enter the amount.
                Your balance will decrease accordingly.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Savings vs Goals
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            While both Savings and Goals help you accumulate money, they serve
            different purposes:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Savings Accounts
              </h4>
              <p className="text-sm text-zinc-500 mt-1">
                More flexible storage for money you want to keep separate from
                your main balance. No target dates or progress tracking.
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Goals
              </h4>
              <p className="text-sm text-zinc-500 mt-1">
                Target-oriented with specific amounts and deadlines. Includes
                progress tracking and status indicators.
              </p>
            </div>
          </div>
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
