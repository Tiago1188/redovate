import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-zinc-900 dark:text-white">
                Redovate
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/dashboard" 
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/templates/select" 
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  Templates
                </Link>
              </nav>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

