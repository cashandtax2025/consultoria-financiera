import { requireAuth } from "@/lib/auth-utils";
import ChartOfAccountsClient from "./chart-client";

export default async function ChartOfAccountsPage() {
  await requireAuth();

  return <ChartOfAccountsClient />;
}
