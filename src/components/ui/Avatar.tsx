"use client";

import { useState } from "react";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
  xl: "w-12 h-12 text-lg",
};

export function Avatar({
  src,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff&bold=true&size=${size === "sm" ? 32 : size === "md" ? 64 : size === "lg" ? 128 : 256}`;

  if (!src || imgError) {
    return (
      <div
        className={`${sizes[size]} rounded-full bg-emerald-600 flex items-center justify-center text-white font-medium ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setImgError(true)}
      className={`${sizes[size]} rounded-full object-cover border-2 border-white dark:border-zinc-900 ${className}`}
    />
  );
}
