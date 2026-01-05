import { getMemory, initMemory } from "@consultoria-financiera/ai";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-utils";

interface MastraMessage {
  id: string;
  role: string;
  content: unknown;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = await params;

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return Response.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    initMemory(connectionString);
    const memory = getMemory();

    const result = await memory.recall({
      threadId,
    });

    const messages = (result.messages ?? []).map((msg: MastraMessage) => ({
      id: msg.id,
      role: msg.role,
      content:
        typeof msg.content === "string"
          ? msg.content
          : JSON.stringify(msg.content),
    }));

    return Response.json({ messages });
  } catch (error) {
    console.error("Failed to get messages", error);
    return Response.json({ error: "Failed to get messages" }, { status: 500 });
  }
}
