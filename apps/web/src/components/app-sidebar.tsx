"use client";

import {
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  ChevronDown,
  ChevronLeft,
  FileSpreadsheet,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Upload,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { Button } from "./ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/extract",
    label: "Extracción",
    icon: FileSpreadsheet,
  },
  {
    href: "/import",
    label: "Importar",
    icon: Upload,
  },
  {
    href: "/analytics",
    label: "Análisis",
    icon: BarChart3,
  },
  {
    href: "/accounting",
    label: "Contabilidad",
    icon: BookOpen,
  },
  {
    href: "/clients",
    label: "Clientes",
    icon: Building2,
    adminOnly: true,
  },
  {
    href: "#ai",
    label: "IA",
    icon: Bot,
    children: [
      {
        href: "/chat",
        label: "Chat",
        icon: MessageSquare,
      },
      {
        href: "/chat-history",
        label: "Historial",
        icon: History,
      },
    ],
  },
  {
    href: "/admin/users",
    label: "Usuarios",
    icon: Users,
    adminOnly: true,
  },
];

interface AppSidebarProps {
  userRole?: string;
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [expandedSections, setExpandedSections] = useState<string[]>(["#ai"]);
  const isAdmin = userRole === "admin";

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin,
  );

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Sesión cerrada");
      router.push("/");
    } catch {
      toast.error("Error al cerrar sesión");
    }
  };

  const toggleSection = (href: string) => {
    setExpandedSections((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href],
    );
  };

  const isChildActive = (item: NavItem) => {
    if (!item.children) return false;
    return item.children.some((child) => pathname === child.href);
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.href);
    const isActive = pathname === item.href || isChildActive(item);

    if (hasChildren) {
      return (
        <div key={item.href}>
          <button
            type="button"
            onClick={() => toggleSection(item.href)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-180",
                  )}
                />
              </>
            )}
          </button>
          {!isCollapsed && isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l pl-3">
              {item.children?.map((child) => {
                const ChildIcon = child.icon;
                const isChildItemActive = pathname === child.href;
                return (
                  <Link
                    key={child.href}
                    href={child.href as "/chat" | "/chat-history"}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isChildItemActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <ChildIcon className="h-4 w-4" />
                    {child.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={
          item.href as
            | "/dashboard"
            | "/extract"
            | "/import"
            | "/analytics"
            | "/accounting"
            | "/clients"
            | "/admin/users"
        }
        onClick={() => setIsOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-default"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
              onClick={() => setIsOpen(false)}
            >
              <BarChart3 className="h-6 w-6 shrink-0" />
              {!isCollapsed && <span className="text-lg">Consultoría</span>}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-2">
            {filteredNavItems.map(renderNavItem)}
          </nav>

          {/* Footer */}
          <div className="border-t p-2 space-y-1">
            {/* Collapse button - desktop only */}
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                "hidden md:flex w-full",
                !isCollapsed && "justify-start gap-3",
              )}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft
                className={cn(
                  "h-5 w-5 transition-transform shrink-0",
                  isCollapsed && "rotate-180",
                )}
              />
              {!isCollapsed && "Colapsar"}
            </Button>
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "default"}
              className={cn("w-full", !isCollapsed && "justify-start gap-3")}
              asChild
            >
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? "Configuración" : undefined}
              >
                <Settings className="h-5 w-5 shrink-0" />
                {!isCollapsed && "Configuración"}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                "w-full text-muted-foreground hover:text-destructive",
                !isCollapsed && "justify-start gap-3",
              )}
              onClick={handleSignOut}
              title={isCollapsed ? "Cerrar sesión" : undefined}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!isCollapsed && "Cerrar sesión"}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
