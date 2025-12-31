"use client";

/**
 * Create Task Page
 *
 * Page for creating a new task.
 * Requires authentication - redirects to login if not authenticated.
 *
 * @see US1: Create a Task
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth-helper";
import { verifyAuth, logout } from "@/lib/api";
import TaskForm from "@/components/tasks/TaskForm";

export default function NewTaskPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user has token
      if (!isAuthenticated()) {
        router.push("/login?redirect=/tasks/new");
        return;
      }

      // Verify token with backend
      const result = await verifyAuth();
      if (!result.data?.authenticated) {
        logout();
        router.push("/login?redirect=/tasks/new");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
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
          <p className="mt-3 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/tasks"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Tasks
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="py-8">
        <TaskForm mode="create" />
      </main>
    </div>
  );
}
