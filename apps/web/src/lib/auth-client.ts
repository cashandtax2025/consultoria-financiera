import type { Auth, Session, User } from "@consultoria-financiera/auth";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [adminClient(), inferAdditionalFields<Auth>()],
});

export const { useSession, signIn, signOut, signUp } = authClient;

// Re-export types for convenience
export type { Session, User };
