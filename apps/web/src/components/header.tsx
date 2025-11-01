"use client";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import UserMenu from "./user-menu";

export default function Header() {
  const { data: session } = useSession();

  const authenticatedLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/extract", label: "Extracción" },
    { to: "/analytics", label: "Análisis" },
    { to: "/todos", label: "Tareas" },
    { to: "/ai", label: "IA" },
  ] as const;

  const adminLinks = [{ to: "/admin/users", label: "Usuarios" }] as const;

  const publicLinks = [{ to: "/", label: "Inicio" }] as const;

  const isAdmin = session?.user?.role === "admin";
  const links = session?.user
    ? isAdmin
      ? [...authenticatedLinks, ...adminLinks]
      : authenticatedLinks
    : publicLinks;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl">
            Consultoría Financiera
          </Link>
          <nav className="hidden md:flex gap-6">
            {links.map(({ to, label }) => {
              return (
                <Link
                  key={to}
                  href={to}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {session?.user ? (
            <UserMenu />
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>
      <hr />
    </div>
  );
}
