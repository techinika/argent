import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ToastProvider } from "@/context/ToastContext";
import { AdPreferencesProvider } from "@/context/AdPreferencesContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Argent - Finance Management",
  description:
    "Comprehensive finance management for businesses and personal finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1268572467254702"
          crossOrigin="anonymous"
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
