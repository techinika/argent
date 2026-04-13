import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Argent Finance Documentation - Overview",
  description:
    "Welcome to Argent Finance Management documentation. Learn how to manage your personal and business finances effectively.",
  keywords: [
    "argent finance",
    "finance management",
    "money management",
    "budget tracking",
    "personal finance",
    "business finance",
  ],
};

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Welcome to Argent Finance Documentation
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">
          Argent is a comprehensive finance management application designed to
          help you track, manage, and optimize your personal and business
          finances. This documentation will guide you through all the features
          and capabilities of the application.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-labelledby="getting-started-title"
            >
              <title id="getting-started-title">Getting Started</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Getting Started
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            New to Argent? Start here to learn how to create an account, set up
            your profile, and navigate the application.
          </p>
          <Link
            href="/docs/getting-started"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Read Getting Started Guide →
          </Link>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-labelledby="personal-finance-title"
            >
              <title id="personal-finance-title">Personal Finance</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Personal Finance
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Learn how to track personal transactions, set budgets, manage
            savings goals, and handle debts.
          </p>
          <Link
            href="/docs/personal-finance"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Explore Personal Finance →
          </Link>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-labelledby="business-finance-title"
            >
              <title id="business-finance-title">Business Finance</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Business Finance
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Discover business-specific features including team management,
            invoicing, and tax calculations.
          </p>
          <Link
            href="/docs/business-finance"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Explore Business Finance →
          </Link>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-labelledby="switching-accounts-title"
            >
              <title id="switching-accounts-title">Switching Accounts</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Switching Accounts
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Learn how to switch between personal and business accounts, and
            understand the limitations.
          </p>
          <Link
            href="/docs/switching-accounts"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Learn About Switching →
          </Link>
        </div>
      </div>

      <div className="bg-zinc-100 dark:bg-zinc-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
          Need More Help?
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
          If you encounter issues not covered in the documentation, check our
          troubleshooting guide or contact support.
        </p>
        <Link
          href="/docs/troubleshooting"
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
        >
          View Troubleshooting Guide →
        </Link>
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
