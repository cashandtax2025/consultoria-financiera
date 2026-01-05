import { getMemory, initMemory } from "@consultoria-financiera/ai";
import { getSession } from "@/lib/auth-utils";

interface MastraThread {
  id: string;
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return Response.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    initMemory(connectionString);
    const memory = getMemory();
    const resourceId = session.user.id;

    const result = await memory.listThreadsByResourceId({
      resourceId,
    });

    const formattedThreads = (result.threads ?? []).map((t: MastraThread) => ({
      id: t.id,
      title: t.title ?? "Conversación",
      createdAt: t.createdAt ?? new Date(),
      updatedAt: t.updatedAt ?? new Date(),
    }));

    return Response.json({ threads: formattedThreads });
  } catch (error) {
    console.error("Failed to list threads", error);
    return Response.json({ error: "Failed to list threads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { title?: string };

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return Response.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    initMemory(connectionString);
    const memory = getMemory();
    const resourceId = session.user.id;

    const thread = await memory.saveThread({
      thread: {
        id: crypto.randomUUID(),
        resourceId,
        title: body.title ?? "Nueva conversación",
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      },
    });

    return Response.json({ thread });
  } catch (error) {
    console.error("Failed to create thread", error);
    return Response.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
