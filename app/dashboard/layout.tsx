import { UserButton } from "@clerk/nextjs";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-sidebar-border bg-surface/50 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <h2 className="font-semibold text-lg text-foreground">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground mr-2">
              Trial Period: <span className="text-primary font-medium">14 Days Left</span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="flex-1 p-8 bg-surface-muted/30">
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

