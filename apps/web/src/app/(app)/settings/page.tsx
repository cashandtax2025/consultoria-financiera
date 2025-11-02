import { requireAuth } from "@/lib/auth-utils";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const session = await requireAuth();

  return <SettingsClient session={session} />;
}

