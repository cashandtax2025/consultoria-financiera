"use client";

import { AppSidebar } from "./app-sidebar";
import { useSession } from "@/lib/auth-client";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar userRole={session?.user?.role ?? undefined} />
      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="container mx-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}

