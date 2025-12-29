export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      <main className="flex flex-col items-center gap-8 p-8 text-center">
        {/* Logo/Title Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white shadow-lg">
            ✓
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            AI-Native Todo
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            A secure, multi-user todo application built with modern technologies.
          </p>
        </div>

        {/* Status Section */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Foundation Phase
          </h2>
          <div className="flex flex-col gap-2 text-left text-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                ✓
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">Next.js App Router initialized</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                ✓
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">TypeScript & Tailwind configured</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400">
                ⏳
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">Authentication (placeholder)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400">
                ⏳
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">API client (placeholder)</span>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Next.js 16+
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            TypeScript
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Tailwind CSS
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Better Auth
          </span>
        </div>

        {/* Footer */}
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Phase 1: Foundation & Project Initialization
        </p>
      </main>
    </div>
  );
}
