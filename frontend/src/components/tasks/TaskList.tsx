"use client";

/**
 * TaskList Component
 *
 * Displays a list of tasks with:
 * - Empty state when no tasks
 * - Loading state while fetching
 * - Error state for API errors
 * - Task cards with update/delete handlers
 *
 * @see US2: View Task List
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { Task, getTasks } from "@/lib/api";
import { getUser } from "@/lib/auth-helper";
import TaskCard from "./TaskCard";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch tasks on mount
   */
  useEffect(() => {
    const fetchTasks = async () => {
      const user = getUser();
      if (!user) {
        setError("You must be logged in to view tasks");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getTasks(user.id);
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setTasks(result.data.tasks);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load tasks"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  /**
   * Handle task update
   */
  const handleUpdate = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  /**
   * Handle task delete
   */
  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
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
          <p className="mt-3 text-gray-500">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
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
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-16 w-16 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
        <p className="mt-2 text-gray-500">
          Get started by creating your first task.
        </p>
        <Link
          href="/tasks/new"
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Task
        </Link>
      </div>
    );
  }

  // Task list
  const completedCount = tasks.filter((t) => t.is_completed).length;

  return (
    <div>
      {/* Stats */}
      <div className="mb-4 text-sm text-gray-500">
        {completedCount} of {tasks.length} tasks completed
      </div>

      {/* Task cards */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
