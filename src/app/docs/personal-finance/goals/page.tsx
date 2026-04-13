import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personal Goals - Argent Finance Documentation",
  description:
    "Learn how to set and track financial goals for your personal finances in Argent.",
  keywords: [
    "financial goals",
    "savings goals",
    "goal tracking",
    "money goals",
    "target savings",
  ],
};

export default function PersonalGoalsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Personal Goals
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">
            Set financial goals and track your progress toward achieving them.
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
            Creating a Goal
          </h3>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
            <p className="text-zinc-600 dark:text-zinc-400">
              To create a new financial goal:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Navigate to the Goals page under Personal</li>
              <li>Click the "+ Add Goal" button</li>
              <li>
                Enter a name for your goal (e.g., "Emergency Fund", "New Car")
              </li>
              <li>Set the target amount you want to save</li>
              <li>Set the target date by which you want to achieve the goal</li>
              <li>Add an optional description</li>
              <li>Click "Save" to create your goal</li>
            </ol>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Goal Types
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Common financial goals include:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Emergency Fund
              </h4>
              <p className="text-sm text-zinc-500">
                3-6 months of living expenses
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Vacation
              </h4>
              <p className="text-sm text-zinc-500">
                Travel and holiday expenses
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Large Purchase
              </h4>
              <p className="text-sm text-zinc-500">
                Car, furniture, electronics
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Education
              </h4>
              <p className="text-sm text-zinc-500">
                Courses, certifications, degree
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Home
              </h4>
              <p className="text-sm text-zinc-500">Down payment, renovation</p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Retirement
              </h4>
              <p className="text-sm text-zinc-500">
                Long-term retirement savings
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Tracking Progress
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Each goal shows:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Progress Bar:</strong> Visual representation of your
              progress
            </li>
            <li>
              <strong>Current vs Target:</strong> How much you have saved vs
              your goal
            </li>
            <li>
              <strong>Target Date:</strong> When you plan to achieve the goal
            </li>
            <li>
              <strong>Days Remaining:</strong> Time left to reach your target
            </li>
            <li>
              <strong>Suggested Monthly:</strong> How much to save monthly to
              meet your goal
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Adding to a Goal
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            To add money toward a goal:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Find the goal on your Goals page</li>
            <li>Click the "Add Savings" button</li>
            <li>Enter the amount you want to add</li>
            <li>
              The progress bar and current amount will update automatically
            </li>
          </ol>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
            Goal Status
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
              <h4 className="font-medium text-emerald-800 dark:text-emerald-300">
                On Track
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                You are making sufficient progress to meet your goal
              </p>
            </div>
            <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                At Risk
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                You need to increase your savings rate to meet your goal
              </p>
            </div>
            <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h4 className="font-medium text-red-800 dark:text-red-300">
                Behind
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                You are behind schedule and may need to adjust your goal
              </p>
            </div>
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
