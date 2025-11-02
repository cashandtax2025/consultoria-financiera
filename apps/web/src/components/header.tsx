"use client";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import UserMenu from "./user-menu";
import { BarChart3 } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  const publicLinks = [
    { to: "/acerca-de", label: "Acerca de" },
    { to: "/casos-de-exito", label: "Casos de éxito" },
    { to: "/blog", label: "Blog" },
    { to: "/contacto", label: "Contacto" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BarChart3 className="h-6 w-6" />
            <span className="hidden sm:inline">Consultoría Financiera</span>
            <span className="sm:hidden">Consultoría</span>
          </Link>
          {!session?.user && (
            <nav className="hidden md:flex gap-6">
              {publicLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  href={to}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle />
          {session?.user ? (
            <Button asChild variant="default" size="sm">
              <Link href="/dashboard">Ir al Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
