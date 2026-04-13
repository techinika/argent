"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signInSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignInForm() {
  const router = useRouter();
  const { signIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  if (user) {
    router.push(user.role === "business" ? "/business" : "/personal");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const parsed = signInSchema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Validation failed");
      setLoading(false);
      return;
    }

    try {
      await signIn(formData.email, formData.password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-emerald-600">
              Argent
            </Link>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white mt-4">
              Sign In
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              Welcome back
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              required
            />

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-zinc-600 dark:text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex justify-center gap-4 text-sm">
              <Link href="/" className="text-zinc-500 hover:text-emerald-600">
                Home
              </Link>
              <Link
                href="/terms"
                className="text-zinc-500 hover:text-emerald-600"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-zinc-500 hover:text-emerald-600"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
