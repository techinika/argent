"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
        <div className="w-9 h-9" />
        <div className="w-9 h-9" />
        <div className="w-9 h-9" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md transition-all ${
          resolvedTheme === "light"
            ? "bg-white dark:bg-zinc-700 shadow-sm"
            : "hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
        }`}
        aria-label="Light mode"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md transition-all ${
          resolvedTheme === "dark"
            ? "bg-white dark:bg-zinc-700 shadow-sm"
            : "hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
        }`}
        aria-label="Dark mode"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`p-2 rounded-md transition-all ${
          theme === "system" &&
          resolvedTheme !== "light" &&
          resolvedTheme !== "dark"
            ? "bg-white dark:bg-zinc-700 shadow-sm"
            : "hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
        }`}
        aria-label="System theme"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>
    </div>
  );
}
