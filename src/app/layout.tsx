import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ToastProvider } from "@/context/ToastContext";
import { AdPreferencesProvider } from "@/context/AdPreferencesContext";

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
  metadataBase: new URL("https://argent.techinika.com"),
  openGraph: {
    type: "website",
    title: "Argent - Finance Management for Personal and Business",
    description:
      "Comprehensive finance management for personal and business. Track budgets, transactions, savings, goals, and team expenses.",
    url: "https://argent.techinika.com",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dm-sans-regular font-sans`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1268572467254702"
          crossOrigin="anonymous"
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-QFCCQ0X391`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QFCCQ0X391');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white transition-colors antialiased">
        <ThemeProvider>
          <AdPreferencesProvider>
            <ToastProvider>
              <AuthProvider>{children}</AuthProvider>
            </ToastProvider>
          </AdPreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
