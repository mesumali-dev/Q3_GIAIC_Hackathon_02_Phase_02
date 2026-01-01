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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
    <div className="min-h-screen bg-[#FAFAFA] overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-[120px] animate-pulse"
          style={{
            background: "radial-gradient(circle, #FF6B35 0%, #F7931E 50%, transparent 70%)",
            top: "-20%",
            right: "-10%",
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #FF1744 0%, #FF6B35 50%, transparent 70%)",
            bottom: "10%",
            left: "-5%",
            animation: "pulse 4s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-[80px]"
          style={{
            background: "radial-gradient(circle, #00BFA5 0%, #1DE9B6 50%, transparent 70%)",
            top: "40%",
            right: "20%",
            animation: "pulse 5s ease-in-out infinite alternate-reverse",
          }}
        />
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-3 bg-white/80 backdrop-blur-2xl rounded-2xl border border-gray-200/50 shadow-lg shadow-gray-200/20">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">Flowdo</span>
                  <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">AI-Powered Todo</span>
                </div>
              </Link>

              {/* Nav Links - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-1">
                {["Features", "How it Works", "AI Power"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-2">
                {isPending ? (
                  <div className="w-8 h-8 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin" />
                ) : user ? (
                  <>
                    <Link
                      href="/tasks"
                      className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all hover:-translate-y-0.5"
                    >
                      My Tasks
                    </Link>
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="px-4 py-2.5 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors"
                    >
                      {isSigningOut ? "..." : "Sign Out"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="px-4 py-2.5 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="group px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-8 border border-orange-200/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span className="text-sm font-semibold text-orange-700">New: AI Task Generation</span>
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6">
                Organize life
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                    beautifully.
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8.5C50 2 100 2 150 5.5C200 9 250 6 298 3" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                        <stop stopColor="#F97316"/>
                        <stop offset="0.5" stopColor="#EF4444"/>
                        <stop offset="1" stopColor="#EC4899"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-lg">
                The task manager that balances <span className="font-semibold text-gray-900">power</span> and{" "}
                <span className="font-semibold text-gray-900">simplicity</span>. Designed for modern teams who move fast.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/30 transition-all hover:-translate-y-1 flex items-center gap-3"
                >
                  Start for free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="#how-it-works"
                  className="group px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  See how it works
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Trusted by 10,000+ teams</p>
                <div className="flex items-center gap-6 text-gray-400">
                  {["Acme Corp", "GlobalBank", "TechStart", "Future Labs"].map((company) => (
                    <span key={company} className="text-sm font-bold tracking-wide hover:text-gray-600 transition-colors cursor-default">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - App Preview */}
            <div className="relative lg:h-[600px]">
              {/* Main Card */}
              <div
                className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
                style={{
                  transform: `perspective(1000px) rotateY(${(mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) / 100}deg) rotateX(${-(mousePosition.y - 300) / 100}deg)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                {/* Window Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-lg border border-gray-200">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs text-gray-400 font-medium">Secure</span>
                  </div>
                </div>

                {/* App Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">My Tasks</h3>
                      <p className="text-sm text-gray-500">5 tasks remaining today</p>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3">
                    {[
                      { title: "Q4 Marketing Strategy", time: "10:00 AM", tag: "Priority", tagColor: "bg-red-100 text-red-600", done: true },
                      { title: "Design System Review", time: "2:30 PM", tag: "Design", tagColor: "bg-violet-100 text-violet-600", done: false },
                      { title: "Client Meeting", time: "4:00 PM", tag: "Sales", tagColor: "bg-emerald-100 text-emerald-600", done: false },
                    ].map((task, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                          task.done ? "bg-gray-50" : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          task.done
                            ? "bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-400"
                            : "border-gray-300"
                        }`}>
                          {task.done && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${task.done ? "text-gray-400 line-through" : "text-gray-900"}`}>{task.title}</p>
                          <p className="text-xs text-gray-400">{task.time}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.tagColor}`}>{task.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insight Banner */}
                <div className="mx-6 mb-6 p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/80 text-xs font-medium">Productivity Insight</p>
                    <p className="text-white font-bold">You&apos;re 20% faster than yesterday!</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-4 -right-4 px-4 py-3 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700">Task Complete</span>
              </div>

              <div className="absolute top-20 -left-8 px-4 py-3 bg-white rounded-2xl shadow-xl border border-gray-100 hidden lg:flex items-center gap-3" style={{ animation: "float 4s ease-in-out infinite" }}>
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700">Smart Reminder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full mb-6 border border-violet-200/50">
              <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="text-sm font-semibold text-violet-700">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Everything you need
              <br />
              <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">and more.</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Packed with innovative features that make task management delightful, productive, and collaborative.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 lg:col-span-2 group p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border border-orange-100 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">Smart Automation</h3>
                    <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">AI-Powered</span>
                  </div>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Let AI handle repetitive tasks. Auto-categorize, prioritize, and schedule tasks based on your workflow patterns.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Automatic categorization", "Smart priority", "Pattern recognition"].map((item) => (
                      <span key={item} className="px-3 py-1.5 bg-white/80 rounded-full text-sm text-gray-700 font-medium border border-orange-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:block px-4 py-2 bg-white rounded-xl shadow-lg border border-orange-100">
                  <p className="text-xs text-gray-400">Auto-schedule</p>
                  <p className="text-lg font-bold text-gray-900">~2h/week saved</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-600 text-sm mb-4">Real-time updates and seamless task delegation.</p>
              <div className="flex -space-x-2">
                {["bg-orange-400", "bg-violet-400", "bg-emerald-400", "bg-pink-400"].map((color, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">+5</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl border border-violet-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 text-sm mb-4">Track progress and optimize your workflow.</p>
              <div className="flex items-end gap-1 h-12">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-violet-500 to-purple-400 rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl border border-amber-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">Built for speed. Manage tasks in milliseconds.</p>
            </div>

            {/* Feature 5 */}
            <div className="group p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl border border-cyan-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Works Everywhere</h3>
              <p className="text-gray-600 text-sm">Access from any device, anytime.</p>
            </div>

            {/* Feature 6 */}
            <div className="group p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl border border-pink-100 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/25 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your data is encrypted and protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="text-orange-400 font-bold text-sm uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-6">
              Simple as <span className="text-orange-400">1, 2, 3</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Get started in seconds. No complicated setup required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up free with just your email. No credit card required.", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
              { step: "02", title: "Add Your Tasks", desc: "Type naturally or let AI break down your goals into tasks.", icon: "M12 4v16m8-8H4" },
              { step: "03", title: "Get Things Done", desc: "Focus on what matters. Check off tasks and celebrate wins.", icon: "M5 13l4 4L19 7" },
            ].map((item, i) => (
              <div key={i} className="relative group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-orange-500/50 to-transparent" />
                )}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-8 shadow-2xl shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <span className="text-5xl font-black text-white">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Power Section */}
      <section id="ai-power" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Chat Preview */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Chat Header */}
                <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold">AI Assistant</h4>
                      <p className="text-white/70 text-sm">Always ready to help</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-xs">
                      <p className="text-gray-700 text-sm">Good morning! You have 3 high-priority tasks. Want me to schedule focus blocks?</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl rounded-tr-none px-4 py-3 max-w-xs">
                      <p className="text-white text-sm">Yes, clear my morning for deep work.</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">ME</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-xs">
                      <p className="text-gray-700 text-sm">Done! I&apos;ve blocked 9 AM - 12 PM for focus time. Notifications paused.</p>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 text-sm">Ask anything...</span>
                    <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-6 border border-orange-200/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span className="text-sm font-semibold text-orange-700">AI-Powered</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                Your personal
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">AI assistant.</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Chat naturally with our AI to manage tasks, get insights, and stay productive. It learns your patterns and adapts to your workflow.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Natural Language Input", desc: "Just type like you talk" },
                  { title: "Smart Suggestions", desc: "Get intelligent recommendations" },
                  { title: "Auto-Organization", desc: "Tasks sorted automatically" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 md:p-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] text-center overflow-hidden">
            {/* Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/10">
                <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-white/80 font-medium">Limited time: 30-day extended trial</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to get
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">superpowers?</span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
                Join 50,000+ productivity enthusiasts who have replaced chaos with clarity.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/30 transition-all hover:-translate-y-1 flex items-center gap-3"
                >
                  Start my free trial
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a href="#features" className="px-10 py-5 text-white/80 hover:text-white text-lg font-semibold transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  See it in action
                </a>
              </div>
              <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  No credit card
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">Flowdo</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                The task manager that balances power and simplicity. Designed for modern teams.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Product", links: ["Features", "How It Works", "AI Assistant", "Pricing"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-bold text-gray-900 mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">&copy; 2025 Flowdo. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {[
                "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
                "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
              ].map((path, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d={path}/></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(5deg); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
