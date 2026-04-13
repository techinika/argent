import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Troubleshooting - Argent Finance Documentation",
  description:
    "Common issues and solutions for Argent Finance Management application.",
  keywords: [
    "troubleshooting",
    "argent help",
    "common issues",
    "error solutions",
    "argent support",
  ],
};

export default function TroubleshootingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Troubleshooting Guide
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">
          Common issues and their solutions for Argent Finance Management.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Authentication Issues
          </h3>
          <div className="space-y-4">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Cannot Sign In
              </h4>
              <p className="text-sm text-zinc-500 mt-1 mb-2">
                If you are having trouble signing in:
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>Check that you are using the correct email address</li>
                <li>
                  Verify your password is correct (passwords are case-sensitive)
                </li>
                <li>
                  Try resetting your password using the "Forgot Password" link
                </li>
                <li>Clear your browser cache and try again</li>
                <li>Make sure JavaScript is enabled in your browser</li>
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Email Not Verified
              </h4>
              <p className="text-sm text-zinc-500 mt-1 mb-2">
                After signing up, if you cannot access your account:
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>Check your spam/junk folder for the verification email</li>
                <li>
                  Make sure the email address you signed up with is correct
                </li>
                <li>
                  Contact support if you cannot receive the verification email
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Data and Transactions
          </h3>
          <div className="space-y-4">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Transaction Not Saving
              </h4>
              <p className="text-sm text-zinc-500 mt-1 mb-2">
                If your transaction fails to save:
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>Check your internet connection</li>
                <li>Make sure all required fields are filled in</li>
                <li>The amount must be a positive number</li>
                <li>For expenses, ensure you have sufficient balance</li>
                <li>Try refreshing the page and attempting again</li>
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Balance Not Updating
              </h4>
              <p className="text-sm text-zinc-500 mt-1 mb-2">
                If your balance seems incorrect:
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>Wait a few moments for the system to update</li>
                <li>Check for any pending or failed transactions</li>
                <li>Verify all transactions are categorized correctly</li>
                <li>Refresh the page to sync the latest data</li>
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Cannot Delete Transaction
              </h4>
              <p className="text-sm text-zinc-500 mt-1 mb-2">
                Deleting a transaction:
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>Click the delete icon next to the transaction</li>
                <li>Confirm the deletion in the dialog box</li>
                <li>
                  Note: Deleting a transaction does not affect your current
                  balance if it was already processed
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Account Issues
          </h3>
          <div className="space-y-4">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Cannot Switch Account Type
              </h4>
              <p className="text-sm text-zinc-500 mt-1 mb-2">
                If the switch option is disabled:
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>You cannot switch if you have any transactions recorded</li>
                <li>This is to protect your financial data</li>
                <li>
                  Consider creating a separate account for the other account
                  type
                </li>
                <li>
                  <Link
                    href="/docs/switching-accounts"
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Learn more about switching
                  </Link>
                </li>
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Settings Not Saving
              </h4>
              <p className="text-sm text-zinc-500 mt-1 mb-2">
                If your settings changes are not being saved:
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>Ensure you are signed in</li>
                <li>Check your internet connection</li>
                <li>Wait for the save confirmation toast message</li>
                <li>Try clearing browser cache</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Display and UI Issues
          </h3>
          <div className="space-y-4">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Theme Not Changing
              </h4>
              <p className="text-sm text-zinc-500 mt-1 mb-2">
                If the theme toggle is not working:
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>Click the theme toggle in Settings</li>
                <li>The change should be immediate</li>
                <li>Your preference is saved for future visits</li>
                <li>Try refreshing the page after changing</li>
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Page Not Loading Properly
              </h4>
              <p className="text-sm text-zinc-500 mt-1 mb-2">
                If pages appear broken or don't load:
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>Clear your browser cache</li>
                <li>
                  Try using a different browser (Chrome, Firefox, Edge, Safari)
                </li>
                <li>Make sure JavaScript is enabled</li>
                <li>Disable any browser extensions that might interfere</li>
                <li>
                  Try clearing local storage (settings {"->"} privacy {"->"}{" "}
                  clear data)
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Business Account Issues
          </h3>
          <div className="space-y-4">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Team Member Not Receiving Invite
              </h4>
              <p className="text-sm text-zinc-500 mt-1 mb-2">
                If team invitations are not being received:
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>Check the spam/junk folder</li>
                <li>Verify the email address is correct</li>
                <li>Invitations expire after 7 days</li>
                <li>You can resend the invitation from the Team page</li>
                <li>
                  Make sure the invitee doesn't already have an Argent account
                  with that email
                </li>
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Budget Alerts Not Working
              </h4>
              <p className="text-sm text-zinc-500 mt-1 mb-2">
                If you're not receiving budget alerts:
              </p>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>Budget alerts are only available on Business accounts</li>
                <li>Ensure you have set up budgets for your categories</li>
                <li>Check your notification/email settings</li>
                <li>
                  Alerts trigger when you reach 80% and 100% of budget limits
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Still Need Help?
          </h3>
          <div className="bg-zinc-100 dark:bg-zinc-700/50 rounded-lg p-6">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              If you continue to experience issues:
            </p>
            <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2">
              <li>
                Visit our{" "}
                <a
                  href="https://github.com/anomalyco/argent/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  GitHub Issues page
                </a>{" "}
                to report bugs or request features
              </li>
              <li>
                Contact{" "}
                <a
                  href="https://ubunifu.techinika.co.rw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Ubunifu Labs
                </a>{" "}
                for support
              </li>
            </ul>
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
