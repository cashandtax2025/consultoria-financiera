import { requireAdmin } from "@/lib/auth-utils";
import { ClientsClient } from "./clients-client";

export default async function AdminClientsPage() {
  // Automatically checks if user is admin and redirects if not
  await requireAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h1>
        <p className="text-muted-foreground mt-2">
          Administra clientes, crea nuevos y gestiona su información
        </p>
      </div>
      <ClientsClient />
    </div>
  );
}
