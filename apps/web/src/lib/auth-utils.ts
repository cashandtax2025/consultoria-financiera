// Server-side auth utilities for Next.js App Router
import { auth, type Session, type User } from "@consultoria-financiera/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Require authentication on server-side (App Router)
 * Redirects to /login if not authenticated
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}

/**
 * Require admin role on server-side
 * Redirects to /login if not authenticated
 * Redirects to /dashboard if not admin
 */
export async function requireAdmin(): Promise<Session & { user: User }> {
  const session = await requireAuth();

  if (!session.user || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return session as Session & { user: User };
}

/**
 * Require specific role(s) on server-side
 * Redirects to /login if not authenticated
 * Redirects to /dashboard if role doesn't match
 */
export async function requireRole(
  allowedRoles: string[],
): Promise<Session & { user: User }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (!session.user || !allowedRoles.includes(session.user.role || "user")) {
    redirect("/dashboard");
  }

  return session as Session & { user: User };
}

/**
 * Get current session without requiring auth (optional auth)
 * Returns null if not authenticated
 */
export async function getSession(): Promise<Session | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
