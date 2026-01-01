"use client";

/**
 * TaskForm Component
 *
 * Form for creating and editing tasks with:
 * - Title field (required, max 200 chars)
 * - Description field (optional, max 1000 chars)
 * - Client-side validation
 * - Loading state during submission
 * - Error display
 *
 * @see US1: Create a Task
 * @see FR-013: Title validation
 * @see FR-014: Description validation
 */

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTask, updateTask, Task } from "@/lib/api";
import { getUser } from "@/lib/auth-helper";

interface FormErrors {
  title?: string;
  description?: string;
  general?: string;
}

interface TaskFormProps {
  mode?: "create" | "edit";
  task?: Task;
  onSuccess?: (task: Task) => void;
}

export default function TaskForm({
  mode = "create",
  task,
  onSuccess,
}: TaskFormProps) {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Character counters
  const titleCharsLeft = 200 - title.length;
  const descriptionCharsLeft = 1000 - description.length;

  /**
   * Validate form fields
   * @returns true if form is valid
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation (required, 1-200 chars)
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 200) {
      newErrors.title = "Title must be 200 characters or less";
    }

    // Description validation (optional, max 1000 chars)
    if (description.length > 1000) {
      newErrors.description = "Description must be 1000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Get current user
    const user = getUser();
    if (!user) {
      setErrors({ general: "You must be logged in to create tasks" });
      return;
    }

    setIsLoading(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || null,
      };

      let result;
      if (mode === "edit" && task) {
        result = await updateTask(user.id, task.id, taskData);
      } else {
        result = await createTask(user.id, taskData);
      }

      if (result.error) {
        setErrors({ general: result.error });
        return;
      }

      // Success callback or redirect
      if (onSuccess && result.data) {
        onSuccess(result.data);
      } else {
        router.push("/tasks");
        router.refresh();
      }
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 p-8 sm:p-10 border border-white/50">
          {/* Header */}
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center mb-5">
              {mode === "edit" ? (
                <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              {mode === "edit" ? "Edit Task" : "Create New Task"}
            </h1>
            <p className="text-gray-500">
              {mode === "edit"
                ? "Update your task details below"
                : "Add a new task to your list"}
            </p>
          </div>

          {/* General error message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-sm text-rose-600 font-medium">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                maxLength={200}
                className={`w-full px-5 py-4 bg-gray-50/50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all ${
                  errors.title
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-gray-100"
                }`}
                placeholder="What needs to be done?"
                autoComplete="off"
                autoFocus
              />
              <div className="mt-2 flex justify-between items-center">
                {errors.title ? (
                  <p className="text-sm text-rose-500 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.title}
                  </p>
                ) : (
                  <span />
                )}
                <p
                  className={`text-sm font-medium ${
                    titleCharsLeft < 20 ? "text-orange-500" : "text-gray-400"
                  }`}
                >
                  {titleCharsLeft} left
                </p>
              </div>
            </div>

            {/* Description field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                maxLength={1000}
                rows={5}
                className={`w-full px-5 py-4 bg-gray-50/50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all resize-none ${
                  errors.description
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-gray-100"
                }`}
                placeholder="Add more details about this task..."
              />
              <div className="mt-2 flex justify-between items-center">
                {errors.description ? (
                  <p className="text-sm text-rose-500 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.description}
                  </p>
                ) : (
                  <span />
                )}
                <p
                  className={`text-sm font-medium ${
                    descriptionCharsLeft < 100 ? "text-orange-500" : "text-gray-400"
                  }`}
                >
                  {descriptionCharsLeft} left
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    {mode === "edit" ? "Saving..." : "Creating..."}
                  </span>
                ) : mode === "edit" ? (
                  "Save Changes"
                ) : (
                  "Create Task"
                )}
              </button>
              <Link
                href="/tasks"
                className="py-4 px-8 text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold text-lg rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
