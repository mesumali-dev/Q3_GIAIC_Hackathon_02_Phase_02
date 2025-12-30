/**
 * Registration Page
 *
 * Allows new users to create an account.
 * Uses RegisterForm component for form handling.
 *
 * @see US1: User Registration
 */

import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account | Todo App",
  description: "Create a new account to start managing your tasks",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </main>
  );
}
