import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Business Budget - Argent Finance Documentation",
  description:
    "Learn how to set and manage business budgets in Argent for annual and monthly financial planning.",
  keywords: [
    "business budget",
    "annual budget",
    "monthly budget",
    "department budget",
    "business planning",
  ],
};

export default function BusinessBudgetPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Business Budget
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Set and track annual and monthly budgets for your business.
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
            Creating a Budget
          </h3>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
            <p className="text-zinc-600 dark:text-zinc-400">
              To create a new business budget:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Navigate to the Budget page under Business</li>
              <li>Click the "+ Add Budget" button</li>
              <li>Select the budget type (Annual or Monthly)</li>
              <li>Enter the year and amount</li>
              <li>Choose the category</li>
              <li>Click "Save" to create the budget</li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Budget Types
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Annual Budget
              </h4>
              <p className="text-sm text-zinc-500 mt-1">
                Set a yearly budget for a category. The amount is spread across
                12 months for tracking. Best for overall annual planning.
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Monthly Budget
              </h4>
              <p className="text-sm text-zinc-500 mt-1">
                Set a specific monthly amount. Best for tracking recurring
                monthly expenses or variable costs.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Budget Categories
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Business budgets can be set for various categories:
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Operations
              </h4>
              <p className="text-sm text-zinc-500">Day-to-day running costs</p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Marketing
              </h4>
              <p className="text-sm text-zinc-500">Advertising and promotion</p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Payroll
              </h4>
              <p className="text-sm text-zinc-500">Employee compensation</p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Equipment
              </h4>
              <p className="text-sm text-zinc-500">Hardware and machinery</p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Travel
              </h4>
              <p className="text-sm text-zinc-500">Business travel expenses</p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Training
              </h4>
              <p className="text-sm text-zinc-500">Employee development</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Monitoring Budgets
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            The Budget page shows:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Total Budgeted:</strong> Sum of all your budgets for the
              year
            </li>
            <li>
              <strong>Spent (YTD):</strong> Total expenses year-to-date
            </li>
            <li>
              <strong>Remaining:</strong> Budget minus actual spending
            </li>
            <li>
              <strong>Monthly Breakdown:</strong> Detailed view by month
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Budget Alerts
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Business accounts include budget alerts that notify you when you
            approach or exceed budget limits. This helps you stay on track with
            your business financial goals throughout the year.
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
