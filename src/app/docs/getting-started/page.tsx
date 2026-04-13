import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Getting Started - Argent Finance Documentation",
  description:
    "Learn how to get started with Argent Finance Management. Create an account, set up your profile, and begin managing your finances.",
  keywords: [
    "argent getting started",
    "create argent account",
    "setup profile",
    "finance app tutorial",
    "argent sign up",
  ],
};

export default function GettingStartedPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Getting Started with Argent
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">
          This guide will walk you through the initial setup process and help
          you become familiar with Argent Finance Management.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            Create Your Account
          </h3>
          <div className="ml-10 space-y-3 text-zinc-600 dark:text-zinc-400">
            <p>
              Visit the signup page at{" "}
              <Link
                href="/auth/signup"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                /auth/signup
              </Link>{" "}
              and enter your email address and a secure password.
            </p>
            <p>
              You can also sign up using your Google account for a faster
              registration process.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            Verify Your Email
          </h3>
          <div className="ml-10 space-y-3 text-zinc-600 dark:text-zinc-400">
            <p>
              After signing up, you will receive a verification email. Click the
              verification link in the email to activate your account.
            </p>
            <p className="text-sm">
              Note: If you signed up with Google, your email is already
              verified.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            Sign In to Your Account
          </h3>
          <div className="ml-10 space-y-3 text-zinc-600 dark:text-zinc-400">
            <p>
              Go to{" "}
              <Link
                href="/auth/signin"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                /auth/signin
              </Link>{" "}
              and enter your credentials to access Argent.
            </p>
            <p>
              After signing in, you will be redirected to your dashboard based
              on your account type (Personal or Business).
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              4
            </span>
            Configure Your Settings
          </h3>
          <div className="ml-10 space-y-3 text-zinc-600 dark:text-zinc-400">
            <p>Navigate to Settings to customize your experience:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Display Name:</strong> Set how you want to be identified
              </li>
              <li>
                <strong>Currency:</strong> Choose your preferred currency (USD,
                EUR, GBP, etc.)
              </li>
              <li>
                <strong>Date Format:</strong> Select your preferred date format
              </li>
              <li>
                <strong>Email Notifications:</strong> Toggle email updates on or
                off
              </li>
              <li>
                <strong>Theme:</strong> Switch between light and dark mode
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              5
            </span>
            Choose Your Account Type
          </h3>
          <div className="ml-10 space-y-3 text-zinc-600 dark:text-zinc-400">
            <p>Argent offers two account types:</p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                <h4 className="font-medium text-zinc-900 dark:text-white">
                  Personal Account
                </h4>
                <p className="text-sm mt-1">
                  Track personal income and expenses, set savings goals, manage
                  debts, and monitor your financial health.
                </p>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                <h4 className="font-medium text-zinc-900 dark:text-white">
                  Business Account
                </h4>
                <p className="text-sm mt-1">
                  Handle business finances, manage team access, track budgets,
                  and generate reports for your business.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm">
              <strong>Important:</strong> You can switch between account types,
              but only if you have no transactions recorded. Once you have
              transactions, the switch option becomes disabled to protect your
              data.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              6
            </span>
            Add Your First Transaction
          </h3>
          <div className="ml-10 space-y-3 text-zinc-600 dark:text-zinc-400">
            <p>
              Navigate to the Transactions page and click the "+ Add
              Transaction" button to record your first income or expense.
            </p>
            <p>Each transaction requires:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Type:</strong> Income or Expense
              </li>
              <li>
                <strong>Amount:</strong> The monetary value
              </li>
              <li>
                <strong>Category:</strong> A classification (Necessities, Needs,
                Emergencies, etc.)
              </li>
              <li>
                <strong>Description:</strong> Optional details about the
                transaction
              </li>
              <li>
                <strong>Date:</strong> When the transaction occurred
              </li>
            </ul>
          </div>
        </section>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
          Next Steps
        </h3>
        <p className="text-emerald-700 dark:text-emerald-400 mb-4">
          Now that you understand the basics, explore the specific guides:
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/docs/personal-finance"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Personal Finance Guide →
          </Link>
          <Link
            href="/docs/business-finance"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Business Finance Guide →
          </Link>
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
