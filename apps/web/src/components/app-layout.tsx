"use client";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, useSidebar } from "./sidebar-context";

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { data: session } = useSession();
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar userRole={session?.user?.role ?? undefined} />
      <main
        className={cn(
          "flex-1 overflow-y-auto transition-all duration-300",
          isCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <div className="container mx-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
