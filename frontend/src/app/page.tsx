"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, verifyAuth } from "@/lib/api";
import { getStoredUser, isAuthenticated, StoredUser } from "@/lib/auth-helper";

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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-yellow-200/40 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/60 backdrop-blur-xl border-b border-orange-100/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200/50">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">Flowdo</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">Features</a>
            <a href="#workflow" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">Workflow</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            ) : user ? (
              <>
                <Link href="/tasks" className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow">
                  Dashboard
                </Link>
                <button onClick={handleSignOut} disabled={isSigningOut} className="text-sm text-gray-500 hover:text-gray-700">
                  {isSigningOut ? "..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800">Login</Link>
                <Link href="/register" className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow">
                  Try Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Unique Layout */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Centered Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-gray-600">Version 2.0 — Now with smart suggestions</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
              Your thoughts,
              <span className="block bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                perfectly captured.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Stop forgetting important tasks. Flowdo turns your scattered ideas into organized action items that actually get done.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/register"
              className="px-8 py-4 text-white font-semibold bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-xl shadow-orange-200/50 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              Start Capturing Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a href="#workflow" className="px-8 py-4 text-gray-600 font-semibold hover:text-gray-800 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </a>
          </div>

          {/* App Preview - Different Layout */}
          <div className="relative max-w-5xl mx-auto">
            {/* Main Window */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-orange-200/30 border border-orange-100/50 overflow-hidden">
              {/* Browser Chrome */}
              <div className="bg-gradient-to-r from-gray-50 to-orange-50/50 px-6 py-4 border-b border-orange-100/50 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1.5 bg-white rounded-lg text-xs text-gray-400 border border-gray-100">
                    app.flowdo.io
                  </div>
                </div>
              </div>

              {/* App Content */}
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Good morning, Sarah</p>
                    <h2 className="text-2xl font-bold text-gray-800">You have 4 tasks today</h2>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">75%</span>
                    </div>
                    <span className="text-sm font-medium text-orange-700">On track</span>
                  </div>
                </div>

                {/* Task Groups */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Morning Tasks */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Morning</h3>
                    {[
                      { text: "Review pull requests", done: true, time: "9:00 AM" },
                      { text: "Team standup meeting", done: true, time: "10:00 AM" },
                    ].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl opacity-60">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="flex-1 text-sm text-gray-500 line-through">{task.text}</span>
                        <span className="text-xs text-gray-400">{task.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Afternoon Tasks */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Afternoon</h3>
                    {[
                      { text: "Finalize design mockups", done: false, time: "2:00 PM", priority: true },
                      { text: "Send project update email", done: false, time: "4:00 PM" },
                    ].map((task, i) => (
                      <div key={i} className={`flex items-center gap-3 p-4 rounded-xl ${task.priority ? 'bg-orange-50 border-2 border-orange-200' : 'bg-white border border-gray-100'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 ${task.priority ? 'border-orange-400' : 'border-gray-300'}`} />
                        <span className="flex-1 text-sm text-gray-700 font-medium">{task.text}</span>
                        <span className="text-xs text-gray-400">{task.time}</span>
                        {task.priority && <span className="px-2 py-0.5 bg-orange-200 text-orange-700 text-xs font-medium rounded">Priority</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card - Left */}
            <div className="absolute -left-8 top-1/3 bg-white rounded-2xl shadow-xl p-4 border border-orange-100 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Completed</p>
                  <p className="text-lg font-bold text-gray-800">23 tasks</p>
                </div>
              </div>
            </div>

            {/* Floating Card - Right */}
            <div className="absolute -right-8 bottom-1/4 bg-white rounded-2xl shadow-xl p-4 border border-orange-100 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Productivity</p>
                  <p className="text-lg font-bold text-green-600">+34%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-white to-orange-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 rounded-full text-orange-600 font-semibold text-sm mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Powerful Features
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-4">
              Everything you need,<br />
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">nothing you don&apos;t</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              We removed the clutter so you can focus on what matters most.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Large Card - Quick Capture */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-8 md:p-10 text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Lightning Fast Capture</h3>
                <p className="text-white/80 text-lg max-w-md leading-relaxed">
                  Add tasks in seconds with keyboard shortcuts. Your thoughts never escape — capture them before they vanish.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <kbd className="px-2 py-1 bg-white/30 rounded text-sm font-mono">⌘</kbd>
                    <span className="text-sm">+</span>
                    <kbd className="px-2 py-1 bg-white/30 rounded text-sm font-mono">K</kbd>
                  </div>
                  <span className="text-white/70 text-sm">Quick add shortcut</span>
                </div>
              </div>
            </div>

            {/* Small Card - Clean Lists */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 hover:shadow-2xl hover:shadow-orange-100/50 hover:border-orange-200 transition-all duration-300">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Clean Lists</h3>
                <p className="text-gray-500 leading-relaxed">No folders, no tags overload. Just simple lists that make sense.</p>
              </div>
            </div>

            {/* Small Card - Daily Focus */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 hover:shadow-2xl hover:shadow-orange-100/50 hover:border-orange-200 transition-all duration-300">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Daily Focus</h3>
                <p className="text-gray-500 leading-relaxed">See only today&apos;s tasks. Tomorrow can wait until tomorrow.</p>
              </div>
            </div>

            {/* Medium Card - Smart Reminders */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-10 text-white">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Smart Reminders</h3>
                  <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                    We&apos;ll nudge you at the perfect time. No spam, no annoying pings — just gentle reminders when you need them.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Reminder</p>
                        <p className="text-gray-500 text-xs">2 min ago</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">Time to review your design mockups!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Card - Weekly Review */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 hover:shadow-2xl hover:shadow-orange-100/50 hover:border-orange-200 transition-all duration-300">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Weekly Review</h3>
                <p className="text-gray-500 leading-relaxed">See your wins every week. Celebrate progress and adjust.</p>
              </div>
            </div>

            {/* Small Card - Private & Secure */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 hover:shadow-2xl hover:shadow-orange-100/50 hover:border-orange-200 transition-all duration-300">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Private & Secure</h3>
                <p className="text-gray-500 leading-relaxed">Your tasks are yours. Encrypted, private, never sold.</p>
              </div>
            </div>

            {/* Small Card - Cross Platform */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 hover:shadow-2xl hover:shadow-orange-100/50 hover:border-orange-200 transition-all duration-300">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Works Everywhere</h3>
                <p className="text-gray-500 leading-relaxed">Web, mobile, desktop. Your tasks sync instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Your Daily Flow</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-4">
              Three steps to clarity
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              A simple routine that transforms how you work.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Brain Dump", desc: "Every morning, write down everything on your mind. Don't filter, just capture.", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
              { num: "02", title: "Pick Three", desc: "Choose your top 3 tasks for today. The rest can wait. Focus is your superpower.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
              { num: "03", title: "Do & Done", desc: "Work through your list. Check them off. Feel the satisfaction of progress.", icon: "M5 13l4 4L19 7" },
            ].map((step, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-200 to-transparent" />
                )}
                <div className="text-center">
                  <div className="w-28 h-28 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-200/50">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-orange-400 mb-2 block">{step.num}</span>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-500 max-w-xs mx-auto">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-4">
              Free forever. Seriously.
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              We believe everyone deserves great task management. No tricks, no trials.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-10 md:p-12 text-center max-w-lg mx-auto border border-orange-100">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-700">Always Free</span>
            </div>
            <div className="mb-6">
              <span className="text-6xl font-black text-gray-900">$0</span>
              <span className="text-gray-400 text-lg">/month</span>
            </div>
            <ul className="space-y-4 mb-10 text-left">
              {[
                "Unlimited tasks",
                "All features included",
                "Sync across devices",
                "Weekly insights",
                "Priority support",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block w-full py-4 text-white font-semibold bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
            >
              Get Started — It&apos;s Free
            </Link>
            <p className="text-xs text-gray-400 mt-4">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-white to-amber-50/50 overflow-hidden relative">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-100/20 to-amber-100/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/50 backdrop-blur-sm rounded-full border border-orange-100 mb-6">
              <div className="flex -space-x-2">
                {["from-pink-400 to-rose-500", "from-blue-400 to-indigo-500", "from-emerald-400 to-teal-500", "from-orange-400 to-amber-500"].map((color, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full bg-gradient-to-br ${color} border-2 border-white`} />
                ))}
              </div>
              <span className="text-gray-600 text-sm font-medium">Join 10,000+ happy users</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-4">
              Loved by <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">thousands</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what real users say about Flowdo.
            </p>
          </div>
        </div>

        {/* Animated Testimonial Carousel */}
        <div className="relative">
          {/* Gradient Overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Single Row - Scrolls Left */}
          <div className="flex animate-scroll-left">
            <div className="flex gap-5 pr-5">
              {[
                {
                  name: "Sarah Mitchell",
                  role: "Product Designer",
                  company: "Spotify",
                  avatar: "SM",
                  color: "from-pink-400 to-rose-500",
                  text: "Flowdo completely changed how I manage my design projects. The daily focus feature helps me prioritize what actually matters instead of drowning in endless task lists.",
                  rating: 5
                },
                {
                  name: "James Rodriguez",
                  role: "Software Engineer",
                  company: "Google",
                  avatar: "JR",
                  color: "from-blue-400 to-indigo-500",
                  text: "I've tried every productivity app out there. Flowdo is the only one that stuck. It's simple, fast, and doesn't get in my way. Exactly what I needed.",
                  rating: 5
                },
                {
                  name: "Emily Chen",
                  role: "Marketing Lead",
                  company: "Airbnb",
                  avatar: "EC",
                  color: "from-emerald-400 to-teal-500",
                  text: "The 'Pick Three' methodology is genius. I went from feeling overwhelmed every day to actually finishing my important tasks. Game changer!",
                  rating: 5
                },
                {
                  name: "Michael Thompson",
                  role: "Startup Founder",
                  company: "TechCraft",
                  avatar: "MT",
                  color: "from-orange-400 to-amber-500",
                  text: "Running a startup means chaos. Flowdo brought order to my mornings. The brain dump feature is my new daily ritual. Can't imagine work without it.",
                  rating: 5
                },
                {
                  name: "Sophie Anderson",
                  role: "UX Researcher",
                  company: "Meta",
                  avatar: "SA",
                  color: "from-violet-400 to-purple-500",
                  text: "Clean, intuitive, and actually helpful. Flowdo respects my time and helps me focus on what truly matters. Best productivity app I've ever used.",
                  rating: 5
                },
                {
                  name: "Lisa Park",
                  role: "Freelance Writer",
                  company: "Self-employed",
                  avatar: "LP",
                  color: "from-purple-400 to-violet-500",
                  text: "As a freelancer, I juggle multiple clients daily. Flowdo's clean interface helps me stay sane. No clutter, no distractions — just pure focus.",
                  rating: 5
                },
                {
                  name: "David Kumar",
                  role: "Project Manager",
                  company: "Microsoft",
                  avatar: "DK",
                  color: "from-cyan-400 to-blue-500",
                  text: "I recommend Flowdo to my entire team. The weekly review feature is perfect for our retrospectives. Simple yet powerful — that's rare.",
                  rating: 5
                },
                {
                  name: "Anna Williams",
                  role: "CEO",
                  company: "StartupHub",
                  avatar: "AW",
                  color: "from-rose-400 to-pink-500",
                  text: "Finally, a task manager that doesn't overwhelm me with features. Flowdo keeps things simple and that's exactly what busy executives need.",
                  rating: 5
                },
                {
                  name: "Robert Chen",
                  role: "Data Scientist",
                  company: "Netflix",
                  avatar: "RC",
                  color: "from-indigo-400 to-purple-500",
                  text: "The morning brain dump changed my life. I start each day with clarity instead of chaos. Highly recommend to anyone feeling overwhelmed.",
                  rating: 5
                },
                {
                  name: "Maria Garcia",
                  role: "Creative Director",
                  company: "Adobe",
                  avatar: "MG",
                  color: "from-amber-400 to-orange-500",
                  text: "Beautiful design meets perfect functionality. Flowdo understands that good UX means getting out of your way. It's become essential to my workflow.",
                  rating: 5
                },
              ].map((testimonial, i) => (
                <div key={i} className="flex-shrink-0 w-[380px] p-6 bg-white rounded-2xl border border-orange-100 hover:border-orange-300 shadow-xl shadow-orange-200/20 transition-all duration-300 group">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <svg className="w-8 h-8 text-orange-500/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 leading-relaxed mb-6 font-medium">&ldquo;{testimonial.text}&rdquo;</p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role} at <span className="text-orange-500 font-medium">{testimonial.company}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex gap-5 pr-5">
              {[
                {
                  name: "Sarah Mitchell",
                  role: "Product Designer",
                  company: "Spotify",
                  avatar: "SM",
                  color: "from-pink-400 to-rose-500",
                  text: "Flowdo completely changed how I manage my design projects. The daily focus feature helps me prioritize what actually matters instead of drowning in endless task lists.",
                  rating: 5
                },
                {
                  name: "James Rodriguez",
                  role: "Software Engineer",
                  company: "Google",
                  avatar: "JR",
                  color: "from-blue-400 to-indigo-500",
                  text: "I've tried every productivity app out there. Flowdo is the only one that stuck. It's simple, fast, and doesn't get in my way. Exactly what I needed.",
                  rating: 5
                },
                {
                  name: "Emily Chen",
                  role: "Marketing Lead",
                  company: "Airbnb",
                  avatar: "EC",
                  color: "from-emerald-400 to-teal-500",
                  text: "The 'Pick Three' methodology is genius. I went from feeling overwhelmed every day to actually finishing my important tasks. Game changer!",
                  rating: 5
                },
                {
                  name: "Michael Thompson",
                  role: "Startup Founder",
                  company: "TechCraft",
                  avatar: "MT",
                  color: "from-orange-400 to-amber-500",
                  text: "Running a startup means chaos. Flowdo brought order to my mornings. The brain dump feature is my new daily ritual. Can't imagine work without it.",
                  rating: 5
                },
                {
                  name: "Sophie Anderson",
                  role: "UX Researcher",
                  company: "Meta",
                  avatar: "SA",
                  color: "from-violet-400 to-purple-500",
                  text: "Clean, intuitive, and actually helpful. Flowdo respects my time and helps me focus on what truly matters. Best productivity app I've ever used.",
                  rating: 5
                },
                {
                  name: "Lisa Park",
                  role: "Freelance Writer",
                  company: "Self-employed",
                  avatar: "LP",
                  color: "from-purple-400 to-violet-500",
                  text: "As a freelancer, I juggle multiple clients daily. Flowdo's clean interface helps me stay sane. No clutter, no distractions — just pure focus.",
                  rating: 5
                },
                {
                  name: "David Kumar",
                  role: "Project Manager",
                  company: "Microsoft",
                  avatar: "DK",
                  color: "from-cyan-400 to-blue-500",
                  text: "I recommend Flowdo to my entire team. The weekly review feature is perfect for our retrospectives. Simple yet powerful — that's rare.",
                  rating: 5
                },
                {
                  name: "Anna Williams",
                  role: "CEO",
                  company: "StartupHub",
                  avatar: "AW",
                  color: "from-rose-400 to-pink-500",
                  text: "Finally, a task manager that doesn't overwhelm me with features. Flowdo keeps things simple and that's exactly what busy executives need.",
                  rating: 5
                },
                {
                  name: "Robert Chen",
                  role: "Data Scientist",
                  company: "Netflix",
                  avatar: "RC",
                  color: "from-indigo-400 to-purple-500",
                  text: "The morning brain dump changed my life. I start each day with clarity instead of chaos. Highly recommend to anyone feeling overwhelmed.",
                  rating: 5
                },
                {
                  name: "Maria Garcia",
                  role: "Creative Director",
                  company: "Adobe",
                  avatar: "MG",
                  color: "from-amber-400 to-orange-500",
                  text: "Beautiful design meets perfect functionality. Flowdo understands that good UX means getting out of your way. It's become essential to my workflow.",
                  rating: 5
                },
              ].map((testimonial, i) => (
                <div key={i} className="flex-shrink-0 w-[380px] p-6 bg-white rounded-2xl border border-orange-100 hover:border-orange-300 shadow-xl shadow-orange-200/20 transition-all duration-300 group">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <svg className="w-8 h-8 text-orange-500/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 leading-relaxed mb-6 font-medium">&ldquo;{testimonial.text}&rdquo;</p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role} at <span className="text-orange-500 font-medium">{testimonial.company}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="max-w-6xl mx-auto px-6 mt-16 text-center">
          <p className="text-sm text-gray-400 mb-6">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-30">
            {["Google", "Microsoft", "Spotify", "Airbnb", "Stripe", "Notion"].map((company, i) => (
              <span key={i} className="text-xl font-bold text-gray-400">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Stop planning. Start doing.
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of people who finally have their tasks under control.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-3 px-10 py-5 text-orange-600 font-bold text-lg bg-white rounded-2xl shadow-xl shadow-orange-600/20 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Create Your Free Account
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-white/60 text-sm mt-6">No credit card required • Free forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          {/* Footer Top */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xl font-bold">Flowdo</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The simple task manager that helps you focus on what matters most.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Features</a></li>
                <li><a href="#workflow" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Workflow</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Changelog</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">GDPR</a></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© 2025 Flowdo. All rights reserved.</p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
