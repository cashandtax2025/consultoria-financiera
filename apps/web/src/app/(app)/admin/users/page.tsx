import { requireAdmin } from "@/lib/auth-utils";
import { UsersClient } from "./users-client";

export default async function AdminUsersPage() {
  // Automatically checks if user is admin and redirects if not
  await requireAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-2">
          Administra usuarios, roles y permisos
        </p>
      </div>
      <UsersClient />
    </div>
  );
}
