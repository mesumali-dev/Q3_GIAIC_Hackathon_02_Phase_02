"use client";

/**
 * TaskCard Component
 *
 * Displays a single task with:
 * - Title and description
 * - Completion status toggle
 * - Creation date
 * - Edit and delete actions
 *
 * @see US2: View Task List
 * @see US3: Toggle Task Completion
 */

import { useState } from "react";
import Link from "next/link";
import { Task, toggleTaskComplete, deleteTask } from "@/lib/api";
import { getUser } from "@/lib/auth-helper";

interface TaskCardProps {
  task: Task;
  onUpdate?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /**
   * Handle toggle completion
   */
  const handleToggle = async () => {
    const user = getUser();
    if (!user) return;

    setIsToggling(true);
    try {
      const result = await toggleTaskComplete(user.id, task.id);
      if (result.data && onUpdate) {
        onUpdate(result.data);
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
    } finally {
      setIsToggling(false);
    }
  };

  /**
   * Handle delete task
   */
  const handleDelete = async () => {
    const user = getUser();
    if (!user) return;

    setIsDeleting(true);
    try {
      const result = await deleteTask(user.id, task.id);
      if (!result.error && onDelete) {
        onDelete(task.id);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 transition-all ${
        task.is_completed ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.is_completed
              ? "bg-green-500 border-green-500"
              : "border-gray-300 hover:border-green-400"
          } ${isToggling ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
          aria-label={
            task.is_completed ? "Mark as incomplete" : "Mark as complete"
          }
        >
          {task.is_completed && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <h3
            className={`text-lg font-medium ${
              task.is_completed ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-gray-600 text-sm whitespace-pre-wrap">
              {task.description}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Created {formatDate(task.created_at)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex gap-2">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            aria-label="Edit task"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Delete task"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Task?
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete
              &quot;{task.title}&quot;?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
