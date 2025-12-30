/**
 * Login Page
 *
 * Allows existing users to sign in to their account.
 * Uses LoginForm component for form handling.
 *
 * @see US2: User Login
 */

import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In | Todo App",
  description: "Sign in to your account to manage your tasks",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </main>
  );
}
