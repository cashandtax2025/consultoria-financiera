import { requireAuth } from "@/lib/auth-utils";
import TodosClient from "./todos-client";

export default async function TodosPage() {
  await requireAuth();

  return <TodosClient />;
}
