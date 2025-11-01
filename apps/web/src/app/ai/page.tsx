import { requireAuth } from "@/lib/auth-utils";
import AIClient from "./ai-client";

export default async function AIPage() {
  await requireAuth();

  return <AIClient />;
}
