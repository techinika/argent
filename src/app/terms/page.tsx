import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Terms of Use - Argent",
  description: "Terms of Use for Argent Finance Management Application",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-emerald-600">
            Argent
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
            Terms of Use
          </h1>

          <div className="prose dark:prose-invert max-w-none space-y-6 text-zinc-600 dark:text-zinc-400">
            <p>Last updated: April 2026</p>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using Argent, you accept and agree to be bound
                by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily use Argent for personal,
                non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Transfer the materials to another person</li>
                <li>
                  Attempt to reverse engineer any software contained in Argent
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                3. User Account Responsibilities
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of your
                account and password. You agree to accept responsibility for all
                activities that occur under your account or password.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                4. Financial Data and Responsibility
              </h2>
              <p>
                Argent provides financial management tools but does not provide
                financial advice. You are solely responsible for all financial
                decisions and transactions made using the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                5. Privacy
              </h2>
              <p>
                Your privacy is important to us. Please review our{" "}
                <Link
                  href="/privacy"
                  className="text-emerald-600 hover:underline"
                >
                  Privacy Policy
                </Link>
                , which also governs your use of Argent, to understand our
                practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                6. Advertising
              </h2>
              <p>
                Argent displays advertisements to support the service. You can
                disable ads in your account settings. By default, ads are
                enabled.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                7. Limitation of Liability
              </h2>
              <p>
                Argent shall not be liable for any indirect, incidental, or
                consequential damages arising out of your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                8. Contact Information
              </h2>
              <p>
                For questions about these terms, please contact us at:{" "}
                <a
                  href="mailto:products@techinika.com"
                  className="text-emerald-600 hover:underline"
                >
                  products@techinika.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
