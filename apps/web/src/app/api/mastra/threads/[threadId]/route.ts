import { getMemory, initMemory } from "@consultoria-financiera/ai";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth-utils";

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

    const thread = await memory.getThreadById({ threadId });
    if (!thread) {
      return Response.json({ error: "Thread not found" }, { status: 404 });
    }

    return Response.json({ thread });
  } catch (error) {
    console.error("Failed to get thread", error);
    return Response.json({ error: "Failed to get thread" }, { status: 500 });
  }
}

export async function DELETE(
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

    await memory.deleteThread(threadId);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete thread", error);
    return Response.json({ error: "Failed to delete thread" }, { status: 500 });
  }
}
