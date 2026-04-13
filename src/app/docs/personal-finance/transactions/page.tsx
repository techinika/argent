import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personal Transactions - Argent Finance Documentation",
  description:
    "Learn how to track and manage your personal transactions in Argent. Record income and expenses with categories.",
  keywords: [
    "personal transactions",
    "track income",
    "track expenses",
    "transaction categories",
    "income expense tracking",
  ],
};

export default function PersonalTransactionsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Personal Transactions
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Track your income and expenses to maintain a clear picture of your
            finances.
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
            Adding a Transaction
          </h3>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
            <p className="text-zinc-600 dark:text-zinc-400">
              To add a new transaction:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Navigate to your Personal Dashboard or Transactions page</li>
              <li>Click the "+ Add Transaction" button</li>
              <li>Select the transaction type (Income or Expense)</li>
              <li>Enter the amount</li>
              <li>Choose a category</li>
              <li>Add an optional description</li>
              <li>Select the date</li>
              <li>Click "Add" to save</li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Transaction Types
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
              <h4 className="font-medium text-emerald-800 dark:text-emerald-300">
                Income
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                Money you receive, such as salary, freelance work, gifts, or
                investment returns.
              </p>
            </div>
            <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h4 className="font-medium text-red-800 dark:text-red-300">
                Expense
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                Money you spend on necessities, needs, emergencies, or other
                categories.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Categories
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Transactions are categorized to help you understand your spending
            habits:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Necessities
              </h4>
              <p className="text-sm text-zinc-500">
                Essential expenses like rent, utilities, groceries
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Debt Payments
              </h4>
              <p className="text-sm text-zinc-500">
                Loan repayments, credit card payments
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Needs
              </h4>
              <p className="text-sm text-zinc-500">
                Non-essential but important purchases
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Emergencies
              </h4>
              <p className="text-sm text-zinc-500">
                Unexpected expenses, medical costs
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Income
              </h4>
              <p className="text-sm text-zinc-500">
                Salary, bonuses, side income
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Other
              </h4>
              <p className="text-sm text-zinc-500">
                Miscellaneous transactions
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Viewing Transactions
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            The Transactions page shows:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Current Balance:</strong> Your total balance (income minus
              expenses)
            </li>
            <li>
              <strong>Total Income:</strong> Sum of all income transactions
            </li>
            <li>
              <strong>Total Expenses:</strong> Sum of all expense transactions
            </li>
            <li>
              <strong>Spending by Category:</strong> Breakdown of expenses by
              category
            </li>
            <li>
              <strong>Recent Transactions:</strong> List of your latest
              transactions
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Filtering
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Use the category filter dropdown to view transactions for a specific
            category. Select "All Categories" to see all transactions.
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
