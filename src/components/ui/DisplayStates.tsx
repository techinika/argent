"use client";

import { ReactNode } from "react";
import { Button } from "./Button";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.41 16a4 4 0 001.28-7.257C6.885 9.75 9 7.5 12 7.5s5.115 2.25 5.728 5.243a4.4 4.4 0 001.272 7.257m-9.41-16a4 4 0 011.28 7.257C6.5 18.75 9 21 12 21s5.5-2.25 5.728-5.243a4.4 4.4 0 01-1.272-7.258"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
        {message}
      </p>
      {onRetry && <Button onClick={onRetry}>Try Again</Button>}
    </div>
  );
}

export function LoadingDisplay({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
      <p className="text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );
}

export function EmptyDisplay({
  title = "Nothing here yet",
  message,
  action,
  actionLabel = "Get Started",
}: {
  title?: string;
  message?: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 mb-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.5a2 2 0 01-2-2V6a2 2 0 012-2h2.5m0 0h2.5"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
        {title}
      </h2>
      {message && (
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
          {message}
        </p>
      )}
      {action && <Button onClick={action}>{actionLabel}</Button>}
    </div>
  );
}
