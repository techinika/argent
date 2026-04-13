"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AdBannerBottom } from "@/components/ui/AdSense";
import { useAdPreferences } from "@/context/AdPreferencesContext";

export function HomeClient() {
  const { user, loading } = useAuth();
  const { showAds } = useAdPreferences();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push(user.role === "business" ? "/business" : "/personal");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-emerald-600">
                Argent
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
              Master Your Finances
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10">
              Comprehensive finance management for businesses and individuals.
              Track budgets, transactions, goals, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-white dark:bg-zinc-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">
              Choose Your Plan
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="text-emerald-600 mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                  Business Finance
                </h3>
                <ul className="space-y-3 text-zinc-600 dark:text-zinc-400 mb-6">
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Monthly & yearly budgeting
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Track income, expenses, savings
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Budget summaries
                  </li>
                </ul>
                <Link href="/auth/signup?role=business">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="text-emerald-600 mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                  Personal Finance
                </h3>
                <ul className="space-y-3 text-zinc-600 dark:text-zinc-400 mb-6">
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Personal goals & savings
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Monthly planned expenses
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Track debts & receivables
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Category-based tracking
                  </li>
                </ul>
                <Link href="/auth/signup?role=personal">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">
              Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 text-emerald-600">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  Budget Tracking
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Set monthly or yearly budgets and track your spending against
                  them
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 text-emerald-600">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  Financial Goals
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Set and track financial goals with progress indicators
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 text-emerald-600">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  Secure & Private
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Your data is encrypted and stored securely with Firebase
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-4">
        {showAds && <AdBannerBottom />}
        <div className="max-w-6xl mx-auto text-center text-zinc-600 dark:text-zinc-400 space-y-4">
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/terms" className="hover:text-emerald-600">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-emerald-600">
              Privacy
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Argent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
