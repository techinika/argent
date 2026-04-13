import { Metadata } from "next";

type SEOConfig = {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
};

const SITE_NAME = "Argent";
const SITE_URL = "https://argent.app";

export function generateSEO(config: SEOConfig): Metadata {
  const fullTitle =
    config.title === SITE_NAME
      ? config.title
      : `${config.title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: config.description,
    keywords: [
      "finance",
      "budget",
      "money management",
      "personal finance",
      "business finance",
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    openGraph: {
      type: "website",
      url: SITE_URL,
      title: fullTitle,
      description: config.description,
      siteName: SITE_NAME,
      images: config.image ? [config.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: config.description,
      images: config.image ? [config.image] : undefined,
    },
    robots: config.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

export const pageSEO = {
  home: {
    title: SITE_NAME,
    description:
      "Comprehensive finance management for businesses and personal finance. Track budgets, transactions, goals, and more.",
  },
  signIn: {
    title: "Sign In",
    description: "Sign in to your Argent account to manage your finances.",
  },
  signUp: {
    title: "Create Account",
    description:
      "Create a free Argent account to start managing your finances.",
  },
  businessDashboard: {
    title: "Business Dashboard",
    description: "Track your business finances, budgets, and transactions.",
  },
  businessBudget: {
    title: "Budget Management",
    description: "Set and manage your business monthly and yearly budgets.",
  },
  businessTransactions: {
    title: "Business Transactions",
    description: "Record and track all your business income and expenses.",
  },
  businessSummary: {
    title: "Budget Summary",
    description: "View detailed budget summaries and performance reports.",
  },
  businessTeam: {
    title: "Team Management",
    description: "Invite and manage team members for your business.",
  },
  businessSettings: {
    title: "Business Settings",
    description: "Manage your business profile and feature settings.",
  },
  personalDashboard: {
    title: "Personal Dashboard",
    description: "Track your personal finances and financial goals.",
  },
  personalGoals: {
    title: "Financial Goals",
    description: "Set and track your personal financial goals.",
  },
  personalBudget: {
    title: "Planned Expenses",
    description: "Plan and manage your monthly expenses.",
  },
  personalTransactions: {
    title: "Transactions",
    description: "Track your income and expenses by category.",
  },
  personalDebts: {
    title: "Debts & Receivables",
    description: "Track money you owe and money owed to you.",
  },
  personalSavings: {
    title: "Savings",
    description: "Manage your savings accounts and targets.",
  },
  personalSettings: {
    title: "Settings",
    description: "Manage your personal finance preferences.",
  },
};
