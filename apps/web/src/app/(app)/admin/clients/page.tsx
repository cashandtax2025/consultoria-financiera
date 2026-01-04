import { requireAuth } from "@/lib/auth-utils";
import { ClientsClient } from "./clients-client";

export default async function AdminClientsPage() {
  // Check if user is authenticated (available for all authenticated users)
  await requireAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona clientes, crea nuevos y administra su información
        </p>
      </div>
      <ClientsClient />
    </div>
  );
}
