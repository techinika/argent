import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Privacy Policy - Argent",
  description: "Privacy Policy for Argent Finance Management Application",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <div className="prose dark:prose-invert max-w-none space-y-6 text-zinc-600 dark:text-zinc-400">
            <p>Last updated: April 2026</p>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Account information (email, password, name)</li>
                <li>Profile preferences (currency, date format)</li>
                <li>Financial data (transactions, budgets, goals)</li>
                <li>Team member information (for business accounts)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                2. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Provide and maintain our services</li>
                <li>Process your transactions</li>
                <li>Send you administrative information</li>
                <li>Respond to your comments and questions</li>
                <li>Provide advertising (if enabled)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                3. Data Storage and Security
              </h2>
              <p>
                Your data is stored in Firebase Firestore. We implement
                appropriate technical and organizational security measures to
                protect your personal data against unauthorized access,
                alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                4. Third-Party Services
              </h2>
              <p>We may use third-party services that collect information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Google AdSense:</strong> Displays advertisements. You
                  can opt-out in settings.
                </li>
                <li>
                  <strong>Firebase:</strong> Provides authentication and
                  database services.
                </li>
                <li>
                  <strong>Cloudinary:</strong> Handles document uploads.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                5. Data Sharing
              </h2>
              <p>
                We do not sell your personal data. We may share your information
                with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Service providers who assist us in operating the app</li>
                <li>Business team members (for business accounts)</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                6. Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Disable advertising in settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                7. Children&apos;s Privacy
              </h2>
              <p>
                Argent is not intended for use by individuals under the age of
                18. We do not knowingly collect personal information from
                children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                8. Changes to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new policy on this
                page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                9. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:{" "}
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
