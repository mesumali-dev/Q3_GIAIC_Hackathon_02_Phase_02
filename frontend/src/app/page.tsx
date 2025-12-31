"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, verifyAuth } from "@/lib/api";
import { getStoredUser, isAuthenticated, StoredUser } from "@/lib/auth-helper";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      // First check localStorage
      const storedUser = getStoredUser();
      if (!storedUser || !isAuthenticated()) {
        setUser(null);
        setIsPending(false);
        return;
      }

      // Verify with backend
      const result = await verifyAuth();
      if (result.data?.authenticated) {
        setUser(storedUser);
      } else {
        // Token invalid, clear auth
        logout();
        setUser(null);
      }
      setIsPending(false);
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      logout();
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      <main className="flex flex-col items-center gap-8 p-8 text-center">
        {/* Logo/Title Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white shadow-lg">
            ✓
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            AI-Native Todo
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            A secure, multi-user todo application built with modern technologies.
          </p>
        </div>

        {/* Auth Status Section */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {isPending ? (
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 animate-spin text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-zinc-500">Checking authentication...</span>
            </div>
          ) : user ? (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                Authenticated
              </h2>
              <div className="flex flex-col items-center gap-2">
                <p className="text-zinc-700 dark:text-zinc-300">
                  Welcome, <span className="font-medium">{user.name}</span>
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                  {user.email}
                </p>
                <div className="flex gap-3 mt-2">
                  <Link
                    href="/tasks"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    View Tasks
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Not Authenticated
              </h2>
              <div className="flex flex-col items-center gap-2">
                <p className="text-zinc-600 dark:text-zinc-400">
                  Sign in to access your tasks
                </p>
                <div className="flex gap-3 mt-2">
                  <Link
                    href="/login"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Status Section */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Phase 3: Backend Auth Refactor
          </h2>
          <div className="flex flex-col gap-2 text-left text-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                ✓
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">FastAPI backend auth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                ✓
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">JWT authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                ✓
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">SQLModel user model</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                ✓
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">localStorage token storage</span>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Next.js 16+
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            TypeScript
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Tailwind CSS
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            FastAPI
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            SQLModel
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            PyJWT
          </span>
        </div>

        {/* Footer */}
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Phase 3: Backend Authentication Refactor
        </p>
      </main>
    </div>
  );
}
