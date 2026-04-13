import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Business Finance - Argent Finance Documentation",
  description:
    "Learn how to manage your business finances with Argent. Handle transactions, budgets, and team management.",
  keywords: [
    "business finance management",
    "business transactions",
    "team finance",
    "business budget",
    "business accounting",
  ],
};

export default function BusinessFinancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Business Finance Management
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">
          Argent provides specialized tools for business financial management,
          including team collaboration features. This guide covers all the
          features available for business accounts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/docs/business-finance/transactions"
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Transactions
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Record business income and expenses, manage invoices, and track cash
            flow.
          </p>
          <span className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            Learn more →
          </span>
        </Link>

        <Link
          href="/docs/business-finance/budget"
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Budget
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Set annual and monthly budgets for your business departments and
            categories.
          </p>
          <span className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            Learn more →
          </span>
        </Link>

        <Link
          href="/docs/business-finance/team"
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Team Management
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Invite team members, assign roles, and manage access to business
            finances.
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
          Your Business Dashboard provides a quick overview of your business
          financial situation:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
          <li>
            <strong>Total Income:</strong> Sum of all business income
          </li>
          <li>
            <strong>Total Expenses:</strong> Sum of all business expenses
          </li>
          <li>
            <strong>Total Savings:</strong> Business savings and reserves
          </li>
          <li>
            <strong>Investments:</strong> Business investments
          </li>
          <li>
            <strong>Budget Overview:</strong> Budget vs actual spending
          </li>
          <li>
            <strong>Recent Transactions:</strong> Latest business activity
          </li>
        </ul>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">
          Business Features
        </h3>
        <p className="text-purple-700 dark:text-purple-400 mb-4">
          Business accounts include additional features:
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-purple-600">✓</span>
            <span className="text-purple-700 dark:text-purple-400 text-sm">
              Multi-user team access
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-600">✓</span>
            <span className="text-purple-700 dark:text-purple-400 text-sm">
              Budget alerts and reports
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-600">✓</span>
            <span className="text-purple-700 dark:text-purple-400 text-sm">
              Monthly financial reports
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-600">✓</span>
            <span className="text-purple-700 dark:text-purple-400 text-sm">
              Invoice generation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-600">✓</span>
            <span className="text-purple-700 dark:text-purple-400 text-sm">
              Tax calculations
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-600">✓</span>
            <span className="text-purple-700 dark:text-purple-400 text-sm">
              Multi-currency support
            </span>
          </div>
        </div>
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
