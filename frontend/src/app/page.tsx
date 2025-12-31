"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, verifyAuth } from "@/lib/api";
import { getStoredUser, isAuthenticated, StoredUser } from "@/lib/auth-helper";
import { Logo, LogoMark } from "@/components/ui/Logo";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = getStoredUser();
      if (!storedUser || !isAuthenticated()) {
        setUser(null);
        setIsPending(false);
        return;
      }

      const result = await verifyAuth();
      if (result.data?.authenticated) {
        setUser(storedUser);
      } else {
        logout();
        setUser(null);
      }
      setIsPending(false);
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      logout();
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-violet-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-emerald-400/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
            <Logo size="sm" />
            <div className="flex items-center gap-3">
              {!isPending && !user && (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
              {!isPending && user && (
                <Link
                  href="/tasks"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                >
                  Open App
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* ============================================ */}
        {/* SECTION 1: Hero Banner */}
        {/* ============================================ */}
        <section className="relative px-6 py-20 sm:py-28 lg:py-36 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              {/* AI Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/40 dark:to-blue-900/40 rounded-full border border-violet-200/50 dark:border-violet-700/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600"></span>
                </span>
                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Powered by AI</span>
              </div>

              {/* Logo Animation */}
              <div className="mb-10 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 rounded-full blur-3xl opacity-40 animate-pulse scale-150" />
                  <div className="relative bg-white/80 dark:bg-zinc-900/80 p-6 rounded-3xl backdrop-blur-sm">
                    <Logo size="xl" showText={false} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Flow
                </span>
                <span className="text-zinc-800 dark:text-zinc-100">do</span>
              </h1>

              {/* Tagline */}
              <p className="text-2xl sm:text-3xl lg:text-4xl text-zinc-700 dark:text-zinc-300 mb-6 font-semibold">
                Your AI-Powered Task Companion
              </p>
              <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Manage tasks your way — let <span className="text-violet-600 dark:text-violet-400 font-medium">AI assist you</span> or
                take <span className="text-blue-600 dark:text-blue-400 font-medium">full manual control</span>.
                The perfect blend of intelligence and simplicity.
              </p>

              {/* Auth Section */}
              {isPending ? (
                <div className="flex items-center justify-center gap-3 text-zinc-500">
                  <svg className="h-6 w-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-lg">Loading...</span>
                </div>
              ) : user ? (
                <div className="inline-flex flex-col items-center gap-6 p-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-2xl font-bold shadow-lg shadow-emerald-500/30">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                        Welcome back, {user.name?.split(" ")[0]}!
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Link
                      href="/tasks"
                      className="group flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 min-h-[56px]"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      View My Tasks
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="px-6 py-4 text-base font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all min-h-[56px] disabled:opacity-50"
                    >
                      {isSigningOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="group flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 min-h-[64px]"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start Free with AI
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/login"
                    className="px-10 py-5 text-lg font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-xl transition-all duration-300 min-h-[64px]"
                  >
                    I have an account
                  </Link>
                </div>
              )}

              {/* Stats */}
              <div className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16">
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">10x</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Faster with AI</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">100%</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Your Control</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Free</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Forever Plan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 2: Two Ways to Work */}
        {/* ============================================ */}
        <section className="relative px-6 py-24 sm:px-8 lg:px-12 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
                Two Ways to Get Things Done
              </h2>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                Choose your style. Use AI assistance for smart suggestions or take full manual control.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* AI Mode */}
              <div className="group relative p-8 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/50 dark:to-indigo-950/50 rounded-3xl border border-violet-200/50 dark:border-violet-800/50 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500">
                <div className="absolute top-4 right-4 px-3 py-1 bg-violet-100 dark:bg-violet-900/50 rounded-full">
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">AI POWERED</span>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white mb-6 shadow-xl shadow-violet-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-3">AI Assistant Mode</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  Let AI help you organize, prioritize, and manage your tasks intelligently. Get smart suggestions and automate repetitive work.
                </p>
                <ul className="space-y-3">
                  {["Smart task suggestions", "Auto-prioritization", "Natural language input", "Intelligent reminders"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50">
                        <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Manual Mode */}
              <div className="group relative p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-3xl border border-blue-200/50 dark:border-blue-800/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                <div className="absolute top-4 right-4 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">FULL CONTROL</span>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white mb-6 shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-3">Manual Mode</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  Prefer full control? Create, organize, and manage tasks exactly the way you want. Simple, powerful, and distraction-free.
                </p>
                <ul className="space-y-3">
                  {["Quick task creation", "Drag & drop organization", "Custom categories", "Complete flexibility"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 3: How It Works */}
        {/* ============================================ */}
        <section className="relative px-6 py-24 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
                Simple as 1, 2, 3
              </h2>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                Get started in seconds. No complicated setup required.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create Account",
                  description: "Sign up in seconds with just your email. No credit card required.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  ),
                  gradient: "from-blue-500 to-indigo-600"
                },
                {
                  step: "02",
                  title: "Add Your Tasks",
                  description: "Type naturally or use AI to break down your goals into actionable tasks.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  ),
                  gradient: "from-violet-500 to-purple-600"
                },
                {
                  step: "03",
                  title: "Get Things Done",
                  description: "Focus on what matters. Check off tasks and watch your progress grow.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                  gradient: "from-emerald-500 to-teal-600"
                }
              ].map((item, index) => (
                <div key={index} className="relative text-center group">
                  {/* Connector Line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-800" />
                  )}

                  <div className="relative">
                    <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${item.gradient} text-white mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        {item.icon}
                      </svg>
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-sm font-bold text-zinc-800 dark:text-zinc-100 shadow-lg border border-zinc-200 dark:border-zinc-700">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">{item.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 4: Features Grid */}
        {/* ============================================ */}
        <section className="relative px-6 py-24 sm:px-8 lg:px-12 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Powerful features designed to boost your productivity.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "AI Task Generation",
                  description: "Describe your goal and let AI break it into manageable tasks.",
                  icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
                  color: "violet"
                },
                {
                  title: "Smart Prioritization",
                  description: "AI analyzes urgency and importance to suggest what to tackle first.",
                  icon: "M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25",
                  color: "blue"
                },
                {
                  title: "Quick Capture",
                  description: "Add tasks instantly with keyboard shortcuts and quick actions.",
                  icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
                  color: "amber"
                },
                {
                  title: "Progress Tracking",
                  description: "Visualize your accomplishments with beautiful progress charts.",
                  icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
                  color: "emerald"
                },
                {
                  title: "Secure & Private",
                  description: "Your data is encrypted and never shared. You own your data.",
                  icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
                  color: "rose"
                },
                {
                  title: "Works Everywhere",
                  description: "Access your tasks from any device. Synced in real-time.",
                  icon: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
                  color: "cyan"
                }
              ].map((feature, index) => (
                <div key={index} className="group p-6 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${feature.color}-500/20 text-${feature.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 5: CTA Section */}
        {/* ============================================ */}
        <section className="relative px-6 py-24 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative p-12 sm:p-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-[2.5rem] shadow-2xl overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-72 h-72 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
              </div>

              <div className="relative">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Flow?
                </h2>
                <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                  Join thousands of productive people who&apos;ve transformed their task management with Flowdo.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="group flex items-center gap-3 px-10 py-5 text-lg font-semibold text-indigo-600 bg-white rounded-2xl hover:bg-zinc-100 shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Get Started Free
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
                <p className="mt-6 text-sm text-white/60">No credit card required • Free forever plan available</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FOOTER */}
        {/* ============================================ */}
        <footer className="relative px-6 py-16 sm:px-8 lg:px-12 bg-zinc-900 dark:bg-black border-t border-zinc-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <LogoMark size={40} />
                  <span className="text-xl font-bold text-white">Flowdo</span>
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                  Your AI-powered task companion. Manage tasks with intelligence or full manual control.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </a>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">AI Assistant</a></li>
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Changelog</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-zinc-500">
                © 2025 Flowdo. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span>Made with</span>
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>by the Flowdo Team</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
