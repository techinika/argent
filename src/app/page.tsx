import type { Metadata } from "next";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = {
  title: {
    default: "Argent - Finance Management for Personal and Business",
    template: "%s | Argent Finance",
  },
  description:
    "Argent is a comprehensive finance management application for personal and business finances. Track budgets, transactions, savings, goals, debts, and team expenses. Free finance management tool by Ubunifu Labs.",
  keywords: [
    "finance management",
    "personal finance",
    "business finance",
    "budget tracker",
    "money management",
    "expense tracker",
    "income tracker",
    "savings tracker",
    "financial planning",
    "budget planning",
    "debt management",
    "finance app",
    "free finance app",
    "investment tracking",
    "financial goals",
    "Argent finance",
    "Argent app",
    "mobile finance",
    "web finance",
  ],
  authors: [{ name: "Ubunifu Labs", url: "https://ubunifu.techinika.co.rw" }],
  creator: "Ubunifu Labs",
  publisher: "Ubunifu Labs",
  metadataBase: new URL("https://argentfinance.app"),
  openGraph: {
    type: "website",
    title: "Argent - Finance Management for Personal and Business",
    description:
      "Comprehensive finance management for personal and business. Track budgets, transactions, savings, goals, and team expenses.",
    url: "https://argentfinance.app",
    siteName: "Argent Finance",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Argent - Finance Management",
    description:
      "Comprehensive finance management for personal and business finances.",
    creator: "@ubunifulabs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Home() {
  return <HomeClient />;
}
