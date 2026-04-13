import type { Metadata } from "next";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In - Argent",
  description: "Sign in to your Argent account to manage your finances.",
};

export default function SignInPage() {
  return <SignInForm />;
}
