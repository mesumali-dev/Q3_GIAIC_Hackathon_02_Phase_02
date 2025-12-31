"use client";

/**
 * Edit Task Page
 *
 * Page for editing an existing task.
 * Requires authentication - redirects to login if not authenticated.
 *
 * @see US4: Update a Task
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getUser } from "@/lib/auth-helper";
import { verifyAuth, logout, getTask, Task } from "@/lib/api";
import TaskForm from "@/components/tasks/TaskForm";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and load task on mount
  useEffect(() => {
    const loadTask = async () => {
      // Check if user has token
      if (!isAuthenticated()) {
        router.push(`/login?redirect=/tasks/${taskId}/edit`);
        return;
      }

      // Verify token with backend
      const authResult = await verifyAuth();
      if (!authResult.data?.authenticated) {
        logout();
        router.push(`/login?redirect=/tasks/${taskId}/edit`);
        return;
      }

      // Get current user
      const user = getUser();
      if (!user) {
        setError("User not found");
        setIsLoading(false);
        return;
      }

      // Load the task
      const taskResult = await getTask(user.id, taskId);
      if (taskResult.error) {
        setError(taskResult.error);
      } else if (taskResult.data) {
        setTask(taskResult.data);
      }

      setIsLoading(false);
    };

    loadTask();
  }, [router, taskId]);

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
          <p className="mt-3 text-gray-500">Loading task...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
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
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        </main>
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
        {task && <TaskForm mode="edit" task={task} />}
      </main>
    </div>
  );
}
