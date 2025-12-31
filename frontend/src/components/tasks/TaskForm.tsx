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
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {mode === "edit" ? "Edit Task" : "Create New Task"}
        </h1>

        {/* General error message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title field */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              maxLength={200}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] ${
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="What do you need to do?"
              autoComplete="off"
              autoFocus
            />
            <div className="mt-1 flex justify-between">
              {errors.title ? (
                <p className="text-sm text-red-600">{errors.title}</p>
              ) : (
                <span />
              )}
              <p
                className={`text-sm ${titleCharsLeft < 20 ? "text-orange-500" : "text-gray-500"}`}
              >
                {titleCharsLeft} characters left
              </p>
            </div>
          </div>

          {/* Description field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              rows={4}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Add more details about this task..."
            />
            <div className="mt-1 flex justify-between">
              {errors.description ? (
                <p className="text-sm text-red-600">{errors.description}</p>
              ) : (
                <span />
              )}
              <p
                className={`text-sm ${descriptionCharsLeft < 100 ? "text-orange-500" : "text-gray-500"}`}
              >
                {descriptionCharsLeft} characters left
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-h-[44px] transition-colors flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
