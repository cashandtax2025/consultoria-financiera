import { requireAuth } from "@/lib/auth-utils";
import AccountingClient from "./accounting-client";

export default async function AccountingPage() {
  await requireAuth();

  return <AccountingClient />;
}
