import { requireAuth } from "@/lib/auth-utils";
import ExtractClient from "./extract-client";

export default async function ExtractPage() {
  await requireAuth();

  return <ExtractClient />;
}
