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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 blur-xl opacity-30" />
          </div>
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <TaskForm mode="create" />;
}
