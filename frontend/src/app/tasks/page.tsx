"use client";

/**
 * Tasks List Page
 *
 * Displays all tasks for the authenticated user.
 * Requires authentication - redirects to login if not authenticated.
 *
 * @see US2: View Task List
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getStoredUser, StoredUser } from "@/lib/auth-helper";
import { verifyAuth, logout } from "@/lib/api";
import TaskList from "@/components/tasks/TaskList";

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user has token
      if (!isAuthenticated()) {
        router.push("/login?redirect=/tasks");
        return;
      }

      // Verify token with backend
      const result = await verifyAuth();
      if (!result.data?.authenticated) {
        logout();
        router.push("/login?redirect=/tasks");
        return;
      }

      setUser(getStoredUser());
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 blur-xl opacity-30" />
          </div>
          <p className="text-gray-500 font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-32 w-80 h-80 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                Flowdo
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/50 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors hover:bg-white/50 rounded-full"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-10 relative">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
              My Tasks
            </h1>
            <p className="text-gray-500">Stay organized and get things done</p>
          </div>
          <Link
            href="/tasks/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Task
          </Link>
        </div>

        {/* Task list */}
        <TaskList />
      </main>
    </div>
  );
}
