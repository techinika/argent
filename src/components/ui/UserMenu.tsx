"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserMenuProps {
  sidebarOpen?: boolean;
}

export function UserMenu({ sidebarOpen = false }: UserMenuProps) {
  const { user, firebaseUser, signOut } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [memberships, setMemberships] = useState<{ id: string; businessId: string; businessName: string; role: string }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchMemberships() {
      try {
        const memberQuery = query(
          collection(db, "teamMembers"),
          where("userId", "==", user!.uid),
        );
        const memberSnap = await getDocs(memberQuery);

        const membershipsData = await Promise.all(
          memberSnap.docs.map(async (mDoc) => {
            const data = mDoc.data();
            const businessRef = doc(db, "businessSettings", data.businessId);
            const businessSnap = await getDoc(businessRef);
            const businessName = businessSnap.exists()
              ? businessSnap.data().name
              : "Unknown Business";

            return {
              id: mDoc.id,
              businessId: data.businessId,
              businessName,
              role: data.role,
            };
          }),
        );

        setMemberships(membershipsData);
      } catch (err) {
        console.error("Error fetching memberships:", err);
      }
    }

    fetchMemberships();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/signin");
  };

  const handleSwitchWorkspace = (workspace: string) => {
    if (workspace === "personal") {
      router.push("/personal");
    } else if (workspace === "business") {
      router.push("/business");
    } else {
      router.push(`/business/${workspace}`);
    }
    setDropdownOpen(false);
  };

  if (!user) return null;

  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatarUrl =
    firebaseUser?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=059669&color=fff&bold=true`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="User menu"
        aria-expanded={dropdownOpen}
      >
        {sidebarOpen && (
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-white">
              {user.displayName}
            </span>
            <span className="text-xs text-zinc-500 capitalize">
              {user.role}
            </span>
          </div>
        )}
        <div className="relative">
          <img
            src={avatarUrl}
            alt={user.displayName}
            className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
        </div>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={user.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">
                  {user.displayName}
                </p>
                <p className="text-sm text-zinc-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
              Workspaces
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleSwitchWorkspace("personal")}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Personal
              </button>

              {user.role === "business" && (
                <button
                  type="button"
                  onClick={() => handleSwitchWorkspace("business")}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Business
                </button>
              )}

              {memberships.map((membership) => (
                <button
                  key={membership.id}
                  type="button"
                  onClick={() => handleSwitchWorkspace(membership.businessId)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  {membership.businessName}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2">
            <div className="px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
              Appearance
            </div>
            <div className="px-1 py-1">
              <ThemeToggle />
            </div>
          </div>

          <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() =>
                router.push(
                  user.role === "business"
                    ? "/business/settings"
                    : "/personal/settings",
                )
              }
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
          </div>

          <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
