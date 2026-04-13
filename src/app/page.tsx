import type { Metadata } from "next";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = {
  title: "Argent - Finance Management",
  description:
    "Comprehensive finance management for businesses and personal finance. Track budgets, transactions, goals, and more.",
  keywords: [
    "finance",
    "budget",
    "money management",
    "personal finance",
    "business finance",
    "investment",
    "savings",
  ],
  authors: [{ name: "Argent" }],
  creator: "Argent",
  openGraph: {
    type: "website",
    title: "Argent - Finance Management",
    description:
      "Comprehensive finance management for businesses and personal finance.",
    siteName: "Argent",
  },
  twitter: {
    card: "summary_large_image",
    title: "Argent - Finance Management",
    description:
      "Comprehensive finance management for businesses and personal finance.",
  },
};

export default function Home() {
  return <HomeClient />;
}
