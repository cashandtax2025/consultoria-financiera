import { requireAuth } from "@/lib/auth-utils";
import AnalyticsClient from "./analytics-client";

export default async function AnalyticsPage() {
  await requireAuth();

  return <AnalyticsClient />;
}
