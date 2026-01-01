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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 blur-xl opacity-30" />
          </div>
          <p className="text-gray-500 font-medium">Loading task...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-10 px-4 sm:px-6">
        {/* Background Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-rose-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -left-32 w-80 h-80 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-2xl mx-auto relative">
          {/* Back Button */}
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-8 group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to tasks
          </Link>

          {/* Error Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 p-8 sm:p-10 border border-white/50">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Task</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <Link
                href="/tasks"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transition-all"
              >
                Go Back to Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return task ? <TaskForm mode="edit" task={task} /> : null;
}
