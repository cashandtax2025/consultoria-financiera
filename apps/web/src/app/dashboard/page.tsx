import { requireAuth } from "@/lib/auth-utils";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.name}</p>
      <Dashboard session={session} />
    </div>
  );
}
