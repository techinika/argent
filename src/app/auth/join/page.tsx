"use client";

import { Suspense } from "react";
import JoinContent from "./JoinContent";

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      }
    >
      <JoinContent />
    </Suspense>
  );
}