import { requireAdmin } from "@/lib/auth-utils";
import { ClientsClient } from "./clients-client";

export default async function ClientsPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl">Clientes</h1>
        <p className="mt-2 text-muted-foreground">
          Gestiona los clientes de tu consultoría financiera
        </p>
      </div>

      <ClientsClient />
    </div>
  );
}
