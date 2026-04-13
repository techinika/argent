import type { Metadata } from "next";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Create Account - Argent",
  description: "Create a free Argent account to start managing your finances.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
