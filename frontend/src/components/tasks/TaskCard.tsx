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
  onEdit?: (task: Task) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
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
      className={`group bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 ${
        task.is_completed
          ? "border-gray-100 bg-gray-50/50"
          : "border-orange-100/50 hover:border-orange-200"
      }`}
    >
      <div className="p-5 flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`flex-shrink-0 w-7 h-7 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
            task.is_completed
              ? "bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-400 shadow-md shadow-emerald-200/50"
              : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
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
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <h3
            className={`text-lg font-semibold leading-snug ${
              task.is_completed ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-2 text-sm leading-relaxed whitespace-pre-wrap ${
              task.is_completed ? "text-gray-400" : "text-gray-500"
            }`}>
              {task.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(task.created_at)}
            </span>
            {task.is_completed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs font-medium rounded-full">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Done
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit ? (
            <button
              onClick={() => onEdit(task)}
              className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
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
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          ) : (
            <Link
              href={`/tasks/${task.id}/edit`}
              className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
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
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-rose-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Task?
            </h3>
            <p className="text-gray-500 text-center mb-6">
              This will permanently delete &quot;{task.title}&quot;. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-5 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-5 py-3 text-white bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-rose-200/50"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
