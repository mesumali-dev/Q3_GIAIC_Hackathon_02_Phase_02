/**
 * Login Page
 *
 * Allows existing users to sign in to their account.
 * Uses LoginForm component for form handling.
 *
 * @see US2: User Login
 */

import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export const metadata = {
  title: "Sign In | Flowdo",
  description: "Sign in to your account to manage your tasks",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/50 to-rose-200/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-amber-100/40 to-orange-100/40 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 group z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
          Flowdo
        </span>
      </Link>

      <LoginForm />
    </main>
  );
}
