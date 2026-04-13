import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Business Transactions - Argent Finance Documentation",
  description:
    "Learn how to track and manage business transactions in Argent. Record income, expenses, invoices, and more.",
  keywords: [
    "business transactions",
    "business income",
    "business expenses",
    "invoice tracking",
    "cash flow",
  ],
};

export default function BusinessTransactionsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Business Transactions
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Track your business income and expenses to monitor cash flow.
          </p>
        </div>
        <Link
          href="/docs/business-finance"
          className="text-emerald-600 hover:text-emerald-700 text-sm"
        >
          ← Back to Business Finance
        </Link>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Adding a Transaction
          </h3>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
            <p className="text-zinc-600 dark:text-zinc-400">
              To add a new business transaction:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Navigate to your Business Dashboard or Transactions page</li>
              <li>Click the "+ Add Transaction" button</li>
              <li>Select the transaction type</li>
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
                Money received from sales, services, investments, or other
                business sources.
              </p>
            </div>
            <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h4 className="font-medium text-red-800 dark:text-red-300">
                Expense
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                Money spent on business operations, supplies, services, and
                other costs.
              </p>
            </div>
            <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-300">
                Saving
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Money set aside for business reserves, emergencies, or future
                investments.
              </p>
            </div>
            <div className="border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 dark:text-purple-300">
                Investment
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                Money invested in business growth, equipment, or other assets.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Categories
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Business transactions are categorized for accurate financial
            reporting:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Sales
              </h4>
              <p className="text-sm text-zinc-500">
                Product or service sales revenue
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Services
              </h4>
              <p className="text-sm text-zinc-500">
                Consulting, freelance, or service fees
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Operations
              </h4>
              <p className="text-sm text-zinc-500">
                Day-to-day business operations
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Marketing
              </h4>
              <p className="text-sm text-zinc-500">
                Advertising, promotion, marketing costs
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Payroll
              </h4>
              <p className="text-sm text-zinc-500">
                Employee salaries and wages
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Equipment
              </h4>
              <p className="text-sm text-zinc-500">
                Business equipment and assets
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Business-Specific Features
          </h3>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Invoice Tracking:</strong> Track which invoices have been
              paid
            </li>
            <li>
              <strong>Tax Categories:</strong> Separate expense categories for
              tax purposes
            </li>
            <li>
              <strong>Multi-Currency:</strong> Handle transactions in multiple
              currencies (Business feature)
            </li>
            <li>
              <strong>Monthly Reports:</strong> Generate financial reports for
              specific periods
            </li>
          </ul>
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
