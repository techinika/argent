import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Switching Accounts - Argent Finance Documentation",
  description:
    "Learn how to switch between personal and business accounts in Argent Finance.",
  keywords: [
    "switch account",
    "personal to business",
    "business to personal",
    "account type",
    "change account",
  ],
};

export default function SwitchingAccountsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Switching Between Personal and Business Accounts
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">
          Argent allows you to switch between personal and business account
          types. This guide explains how switching works and its limitations.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Understanding Account Switching
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            When you switch your account type:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Your profile:</strong> Display name and settings are
              preserved
            </li>
            <li>
              <strong>Account type:</strong> Changes between personal and
              business
            </li>
            <li>
              <strong>Dashboard:</strong> Redirected to the new account type
              dashboard
            </li>
            <li>
              <strong>Transactions:</strong> Remain with their original account
              type
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            How to Switch
          </h3>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
            <p className="text-zinc-600 dark:text-zinc-400">
              To switch your account type:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Go to Settings for your current account type</li>
              <li>Find the "Account Type" section</li>
              <li>Click the "Switch to [Personal/Business] Account" button</li>
              <li>Confirm the action in the dialog box</li>
              <li>You will be redirected to the new account dashboard</li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Important Limitation
          </h3>
          <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
              Cannot Switch with Existing Transactions
            </h4>
            <p className="text-red-700 dark:text-red-400 text-sm">
              You can only switch account types if you have{" "}
              <strong>no transactions</strong> in your current account. Once you
              have recorded any transactions, the switch option becomes
              disabled. This is to protect your financial data and maintain
              accurate records.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Why This Limitation Exists
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Transactions are categorized differently for personal and business
            accounts:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Personal Transactions
              </h4>
              <p className="text-sm text-zinc-500 mt-1">
                Categories: Necessities, Debt Payments, Needs, Emergencies,
                Income, Other
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Business Transactions
              </h4>
              <p className="text-sm text-zinc-500 mt-1">
                Categories: Sales, Services, Operations, Marketing, Payroll,
                Equipment, etc.
              </p>
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mt-4">
            If switching were allowed with existing transactions, your
            transaction history would not match the new account type's
            categories, leading to confusion and incorrect financial reports.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Before You Have Transactions
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            If you know you want both personal and business features, consider:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Start with one type:</strong> Begin with whichever account
              type you need most right now
            </li>
            <li>
              <strong>Switch early:</strong> Switch to the other type before
              adding any transactions
            </li>
            <li>
              <strong>Create a new account:</strong> If you need both types with
              transactions, create a separate Argent account for each
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            If You Already Have Transactions
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            If you already have transactions and need both personal and business
            features:
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-700/50 rounded-lg p-4">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              <strong>Option:</strong> Create a new Argent account with a
              different email address. Use the personal account for personal
              finances and the new business account (or vice versa) for your
              other finances. This keeps each account's transaction history
              clean and accurate.
            </p>
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
