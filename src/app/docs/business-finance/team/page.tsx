import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Team Management - Argent Finance Documentation",
  description:
    "Learn how to manage team members and access in your Argent Business account.",
  keywords: [
    "team management",
    "business team",
    "user roles",
    "team access",
    "business collaboration",
  ],
};

export default function BusinessTeamPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Team Management
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Invite team members and manage their access to your business
            finances.
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
            Inviting Team Members
          </h3>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
            <p className="text-zinc-600 dark:text-zinc-400">
              To invite a new team member:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Navigate to the Team page under Business</li>
              <li>Click the "+ Invite Member" button</li>
              <li>Enter the team member's email address</li>
              <li>Select a role for the member</li>
              <li>Click "Send Invite" to send the invitation</li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Team Roles
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Owner
              </h4>
              <p className="text-sm text-zinc-500 mt-1">
                Full access to all business features. Can manage team members,
                billing, and all financial data. There is typically one owner
                per business account.
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Admin
              </h4>
              <p className="text-sm text-zinc-500 mt-1">
                Can manage transactions, budgets, and most business features.
                Cannot manage team members or change billing information.
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Manager
              </h4>
              <p className="text-sm text-zinc-500 mt-1">
                Can view and edit transactions and budgets assigned to them.
                Cannot manage team members or sensitive settings.
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Viewer
              </h4>
              <p className="text-sm text-zinc-500 mt-1">
                Read-only access to business financial data. Cannot make any
                changes to transactions, budgets, or settings.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Managing Team Members
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            As an owner or admin, you can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>View team list:</strong> See all members and their current
              roles
            </li>
            <li>
              <strong>Change roles:</strong> Update a member's access level
            </li>
            <li>
              <strong>Remove members:</strong> Remove access for team members
              who no longer need it
            </li>
            <li>
              <strong>Resend invites:</strong> Resend invitation emails to
              pending members
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Role Permissions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-2 px-3 font-medium text-zinc-900 dark:text-white">
                    Permission
                  </th>
                  <th className="text-center py-2 px-3 font-medium text-zinc-900 dark:text-white">
                    Owner
                  </th>
                  <th className="text-center py-2 px-3 font-medium text-zinc-900 dark:text-white">
                    Admin
                  </th>
                  <th className="text-center py-2 px-3 font-medium text-zinc-900 dark:text-white">
                    Manager
                  </th>
                  <th className="text-center py-2 px-3 font-medium text-zinc-900 dark:text-white">
                    Viewer
                  </th>
                </tr>
              </thead>
              <tbody className="text-zinc-600 dark:text-zinc-400">
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-2 px-3">View transactions</td>
                  <td className="text-center py-2 px-3">✓</td>
                  <td className="text-center py-2 px-3">✓</td>
                  <td className="text-center py-2 px-3">✓</td>
                  <td className="text-center py-2 px-3">✓</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-2 px-3">Add/edit transactions</td>
                  <td className="text-center py-2 px-3">✓</td>
                  <td className="text-center py-2 px-3">✓</td>
                  <td className="text-center py-2 px-3">✓</td>
                  <td className="text-center py-2 px-3">-</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-2 px-3">Manage budgets</td>
                  <td className="text-center py-2 px-3">✓</td>
                  <td className="text-center py-2 px-3">✓</td>
                  <td className="text-center py-2 px-3">✓</td>
                  <td className="text-center py-2 px-3">-</td>
                </tr>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-2 px-3">Manage team</td>
                  <td className="text-center py-2 px-3">✓</td>
                  <td className="text-center py-2 px-3">-</td>
                  <td className="text-center py-2 px-3">-</td>
                  <td className="text-center py-2 px-3">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Delete account</td>
                  <td className="text-center py-2 px-3">✓</td>
                  <td className="text-center py-2 px-3">-</td>
                  <td className="text-center py-2 px-3">-</td>
                  <td className="text-center py-2 px-3">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Pending Invitations
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            When you send an invitation, it will appear in the team list as
            "Pending." The invite expires after 7 days. You can resend the
            invitation if needed from the team management page.
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
