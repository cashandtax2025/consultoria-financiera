import { requireAuth } from "@/lib/auth-utils";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Bienvenido, {session.user.name}
        </p>
      </div>
      <Dashboard session={session} />
    </div>
  );
}
