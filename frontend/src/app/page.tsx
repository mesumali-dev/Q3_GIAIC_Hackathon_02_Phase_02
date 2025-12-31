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
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Flowdo</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">How it Works</a>
            <a href="#ai-features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">AI Power</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
            ) : user ? (
              <>
                <Link href="/tasks" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5">
                  My Tasks
                </Link>
                <button onClick={handleSignOut} disabled={isSigningOut} className="px-4 py-2.5 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
                  {isSigningOut ? "..." : "Sign Out"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2.5 text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-100 rounded-full blur-3xl opacity-40" />

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-indigo-700">AI-Powered Task Management</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Get Things Done
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            The smart todo app that adapts to you. Use <span className="text-indigo-600 font-semibold">AI assistance</span> for
            intelligent suggestions or take <span className="text-purple-600 font-semibold">full manual control</span>.
          </p>

          {/* CTA Buttons */}
          {user ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tasks" className="group px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 flex items-center gap-3">
                Open My Tasks
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="group px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 flex items-center gap-3">
                Start Free Today
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/login" className="px-8 py-4 text-gray-700 text-lg font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                Sign In
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-12 mt-16">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">10x</p>
              <p className="text-sm text-gray-500 mt-1">Faster with AI</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">100%</p>
              <p className="text-sm text-gray-500 mt-1">Your Control</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">Free</p>
              <p className="text-sm text-gray-500 mt-1">Forever Plan</p>
            </div>
          </div>

          {/* Hero Image/Mockup */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-4 text-sm text-gray-400">flowdo.app/tasks</span>
              </div>
              <div className="space-y-4">
                {[
                  { title: "Complete project presentation", done: true, priority: "high" },
                  { title: "Review team feedback", done: true, priority: "medium" },
                  { title: "Schedule client meeting", done: false, priority: "high" },
                  { title: "Update documentation", done: false, priority: "low" },
                ].map((task, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${task.done ? 'bg-gray-50' : 'bg-white'} border border-gray-100`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                      {task.done && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex-1 ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'} font-medium`}>{task.title}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-600' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>{task.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features designed to supercharge your productivity</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                ),
                title: "AI Task Assistant",
                description: "Let AI help break down complex goals into actionable tasks automatically.",
                color: "indigo"
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                title: "Lightning Fast",
                description: "Built for speed. Add and manage tasks in milliseconds.",
                color: "yellow"
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "Secure & Private",
                description: "Your data is encrypted and protected. We never share your information.",
                color: "green"
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
                title: "Progress Tracking",
                description: "Visualize your achievements with beautiful progress insights.",
                color: "purple"
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                ),
                title: "Works Everywhere",
                description: "Access your tasks from any device, anytime, anywhere.",
                color: "blue"
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                ),
                title: "Smart Reminders",
                description: "Never miss a deadline with intelligent notification system.",
                color: "pink"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  feature.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  feature.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                  feature.color === 'green' ? 'bg-green-100 text-green-600' :
                  feature.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-pink-100 text-pink-600'
                } group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">Simple as 1, 2, 3</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get started in seconds. No complicated setup required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up for free with just your email. No credit card required.",
                gradient: "from-indigo-500 to-indigo-600"
              },
              {
                step: "02",
                title: "Add Your Tasks",
                description: "Type naturally or let AI help break down your goals into tasks.",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                step: "03",
                title: "Get Things Done",
                description: "Focus on what matters. Check off tasks and celebrate wins.",
                gradient: "from-pink-500 to-pink-600"
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent" />
                )}
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI vs Manual Section */}
      <section id="ai-features" className="py-24 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">Your Choice</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">Two Ways to Work</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Use AI assistance or take full control. The choice is yours.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* AI Mode */}
            <div className="relative p-10 bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 rounded-full mb-6">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-indigo-600 uppercase">AI Powered</span>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Assistant Mode</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Let AI organize, prioritize, and manage your tasks intelligently. Get smart suggestions and automate the boring stuff.</p>
                <ul className="space-y-3">
                  {["Smart task suggestions", "Auto-prioritization", "Natural language input", "Intelligent reminders"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Manual Mode */}
            <div className="relative p-10 bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100 to-teal-100 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full mb-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs font-bold text-green-600 uppercase">Full Control</span>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Manual Mode</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Prefer complete control? Create and organize tasks exactly how you want. Simple, powerful, distraction-free.</p>
                <ul className="space-y-3">
                  {["Quick task creation", "Drag & drop organization", "Custom categories", "Complete flexibility"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 md:p-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[2rem] text-center overflow-hidden shadow-2xl">
            {/* Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                Join thousands of productive people using Flowdo to achieve their goals.
              </p>
              <Link href="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 text-lg font-bold rounded-2xl hover:bg-gray-100 shadow-xl transition-all hover:scale-105">
                Start Free Today
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <p className="mt-6 text-white/60 text-sm">No credit card required. Free forever plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">Flowdo</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Your AI-powered task companion for getting things done.</p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">&copy; 2025 Flowdo. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
