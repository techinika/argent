import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personal Budget - Argent Finance Documentation",
  description:
    "Learn how to set and manage monthly budgets for your personal finances in Argent.",
  keywords: [
    "personal budget",
    "monthly budget",
    "budget planning",
    "spending limit",
    "budget tracking",
  ],
};

export default function PersonalBudgetPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Personal Budget
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Set monthly budgets to control your spending and reach your
            financial goals.
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
            Setting a Budget
          </h3>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
            <p className="text-zinc-600 dark:text-zinc-400">
              To set your monthly budget:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Navigate to the Budget page under Personal</li>
              <li>Click the "+ Add Budget" button</li>
              <li>Select the month and year for your budget</li>
              <li>Enter the budget amount</li>
              <li>
                Choose the category (e.g., Food, Transport, Entertainment)
              </li>
              <li>Click "Save" to create your budget</li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Budget Categories
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            You can create budgets for various spending categories:
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Food & Groceries
              </h4>
              <p className="text-sm text-zinc-500">
                Restaurant, groceries, delivery
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Transport
              </h4>
              <p className="text-sm text-zinc-500">
                Gas, public transit, rideshare
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Entertainment
              </h4>
              <p className="text-sm text-zinc-500">
                Movies, subscriptions, hobbies
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Utilities
              </h4>
              <p className="text-sm text-zinc-500">
                Electric, water, internet, phone
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Shopping
              </h4>
              <p className="text-sm text-zinc-500">
                Clothing, electronics, household
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Health
              </h4>
              <p className="text-sm text-zinc-500">
                Medical, pharmacy, fitness
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Tracking Progress
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            The Budget page shows your spending progress for each category:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Budgeted:</strong> The amount you set as your limit
            </li>
            <li>
              <strong>Spent:</strong> How much you have spent in that category
            </li>
            <li>
              <strong>Remaining:</strong> How much is left in your budget
            </li>
            <li>
              <strong>Progress Bar:</strong> Visual indicator of budget usage
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Budget Alerts
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            When you approach or exceed your budget limit, Argent will show
            visual warnings. Categories nearing their limit appear in yellow,
            while exceeded budgets appear in red.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Editing and Deleting Budgets
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            To modify a budget, click the edit icon next to the budget item. To
            delete a budget, click the delete icon. Note that deleting a budget
            does not affect already recorded transactions.
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
