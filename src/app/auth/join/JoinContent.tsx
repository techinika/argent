"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const businessId = searchParams.get("business");

  const { user, firebaseUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invitation, setInvitation] = useState<{
    businessName: string;
    email: string;
    role: string;
  } | null>(null);

  const [step, setStep] = useState<"verify" | "signup" | "confirm">("verify");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!token || !businessId) {
      setError("Invalid invitation link");
      setLoading(false);
      return;
    }

    async function verifyInvitation() {
      try {
        const inviteRef = doc(db, "teamInvitations", token!);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists()) {
          setError("Invitation not found or has expired");
          setLoading(false);
          return;
        }

        const inviteData = inviteSnap.data();
        const expiresAt = inviteData.expiresAt?.toDate();
        if (expiresAt && expiresAt < new Date()) {
          setError("Invitation has expired");
          setLoading(false);
          return;
        }

        if (inviteData.email !== user?.email && user?.email) {
          setError("This invitation was sent to a different email address");
          setLoading(false);
          return;
        }

        const businessRef = doc(db, "businessSettings", businessId!);
        const businessSnap = await getDoc(businessRef);
        const businessName = businessSnap.exists()
          ? businessSnap.data().name
          : "the organization";

        setInvitation({
          businessName,
          email: inviteData.email,
          role: inviteData.role,
        });

        if (user) {
          setStep("confirm");
        } else {
          setStep("signup");
        }
      } catch (err) {
        console.error("Error verifying invitation:", err);
        setError("Failed to verify invitation");
      } finally {
        setLoading(false);
      }
    }

    verifyInvitation();
  }, [token, businessId, user]);

  const handleCreateAccount = async () => {
    if (!name || !password || !invitation?.email) return;

    setCreating(true);
    setError("");

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        invitation.email,
        password,
      );
      await updateProfile(credential.user, { displayName: name });
      await sendEmailVerification(credential.user);

      await updateDoc(doc(db, "users", credential.user.uid), {
        email: invitation.email,
        displayName: name,
        role: "personal",
        createdAt: new Date(),
      });

      setStep("confirm");
      router.refresh();
    } catch (err: any) {
      console.error("Error creating account:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmJoin = async () => {
    if (!user || !token || !businessId) return;

    setCreating(true);
    setError("");

    try {
      await updateDoc(doc(db, "teamInvitations", token), {
        status: "accepted",
        userId: user.uid,
        joinedAt: new Date(),
      });

      await updateDoc(doc(db, "users", user.uid), {
        role: "business",
      });

      router.push("/business");
    } catch (err) {
      console.error("Error joining team:", err);
      setError("Failed to join the organization");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-red-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Invalid Invitation
            </h1>
            <p className="text-zinc-500 mb-6">{error}</p>
            <Button onClick={() => router.push("/")}>Go to Home</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <Card className="max-w-md w-full">
        {step === "signup" && (
          <>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Join {invitation?.businessName}
            </h1>
            <p className="text-zinc-500 mb-6">
              You&apos;ve been invited to join {invitation?.businessName} as a{" "}
              {invitation?.role}. Create an account to continue.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={invitation?.email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800"
                  placeholder="Create a password"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                onClick={handleCreateAccount}
                loading={creating}
                className="w-full"
              >
                Create Account & Join
              </Button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Join {invitation?.businessName}?
            </h1>
            <p className="text-zinc-500 mb-6">
              You&apos;ve been invited to join {invitation?.businessName} as a{" "}
              {invitation?.role}. Would you like to accept this invitation?
            </p>

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <div className="space-y-4">
              <Button
                onClick={handleConfirmJoin}
                loading={creating}
                className="w-full"
              >
                Accept Invitation
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full"
              >
                Decline
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}