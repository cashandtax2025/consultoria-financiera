import { requireAdmin } from "@/lib/auth-utils";
import { UsersClient } from "./users-client";

export default async function AdminUsersPage() {
  // Automatically checks if user is admin and redirects if not
  await requireAdmin();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage users, roles, and permissions
        </p>
      </div>
      <UsersClient />
    </div>
  );
}
