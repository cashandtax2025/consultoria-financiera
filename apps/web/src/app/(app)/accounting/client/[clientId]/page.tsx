import { requireAuth } from "@/lib/auth-utils";
import ClientMappingClient from "./client-mapping-client";

interface Props {
  params: Promise<{ clientId: string }>;
}

export default async function ClientMappingPage({ params }: Props) {
  await requireAuth();
  const { clientId } = await params;

  return <ClientMappingClient clientId={clientId} />;
}
