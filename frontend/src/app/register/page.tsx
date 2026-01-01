/**
 * Registration Page
 *
 * Allows new users to create an account.
 * Uses RegisterForm component for form handling.
 *
 * @see US1: User Registration
 */

import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata = {
  title: "Create Account | Flowdo",
  description: "Create a new account to start managing your tasks",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-200/50 to-amber-200/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl" />
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

      <RegisterForm />
    </main>
  );
}
