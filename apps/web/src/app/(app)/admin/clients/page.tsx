import { requireAdmin } from "@/lib/auth-utils";
import { ClientsClient } from "./clients-client";

export default async function AdminClientsPage() {
  await requireAdmin();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <p className="text-muted-foreground mt-2">
          Administra los clientes del sistema. Puedes crear, editar y eliminar clientes.
        </p>
      </div>
      <ClientsClient />
    </div>
  );
}

