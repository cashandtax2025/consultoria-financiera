import {
  createAssistantAgent,
  getMemory,
  initMemory,
  type ModelId,
} from "@consultoria-financiera/ai";
import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { nanoid } from "nanoid";
import { getSession } from "@/lib/auth-utils";

export const maxDuration = 30;

async function saveMessageToMemory(
  threadId: string,
  resourceId: string,
  role: "user" | "assistant",
  content: string,
  toolCalls?: Array<{
    toolCallId: string;
    toolName: string;
    args: unknown;
    result: unknown;
  }>,
) {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) return;

    initMemory(connectionString);
    const memory = getMemory();

    const parts: Array<
      | { type: "text"; text: string }
      | {
          type: "tool-invocation";
          toolInvocation: {
            toolCallId: string;
            toolName: string;
            args: unknown;
            result: unknown;
            state: "output-available";
          };
        }
    > = [];

    if (toolCalls && toolCalls.length > 0) {
      for (const tool of toolCalls) {
        parts.push({
          type: "tool-invocation",
          toolInvocation: {
            toolCallId: tool.toolCallId,
            toolName: tool.toolName,
            args: tool.args,
            result: tool.result,
            state: "output-available",
          },
        });
      }
    }

    if (content.trim()) {
      parts.push({ type: "text", text: content });
    }

    await memory.saveMessages({
      messages: [
        {
          id: nanoid(),
          threadId,
          resourceId,
          role,
          content: {
            format: 2 as const,
            parts:
              parts.length > 0 ? parts : [{ type: "text" as const, text: "" }],
          },
          createdAt: new Date(),
        },
      ],
    });
  } catch (error) {
    console.error("Failed to save message", error);
  }
}

function createStreamWithPersistence(
  response: Response,
  threadId: string,
  resourceId: string,
): Response {
  if (!response.body) {
    return response;
  }

  let fullResponse = "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    start(controller) {
      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();

          const lines = fullResponse.split("\n");
          let extractedText = "";
          const toolCalls: Map<
            string,
            {
              toolCallId: string;
              toolName: string;
              args: unknown;
              result: unknown;
            }
          > = new Map();

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.slice(6);
                if (jsonStr === "[DONE]") {
                  continue;
                }
                const data = JSON.parse(jsonStr);

                if (data.type === "tool-input-available") {
                  toolCalls.set(data.toolCallId, {
                    toolCallId: data.toolCallId,
                    toolName: data.toolName,
                    args: data.input,
                    result: undefined,
                  });
                }

                if (data.type === "tool-output-available") {
                  const existing = toolCalls.get(data.toolCallId);
                  if (existing) {
                    existing.result = data.output;
                  }
                }

                if (data.type === "text-delta" && data.delta) {
                  extractedText += data.delta;
                }
              } catch {
                // Not valid JSON
              }
            }
          }

          const toolCallsArray = Array.from(toolCalls.values());

          if (extractedText.trim() || toolCallsArray.length > 0) {
            saveMessageToMemory(
              threadId,
              resourceId,
              "assistant",
              extractedText,
              toolCallsArray.length > 0 ? toolCallsArray : undefined,
            ).catch((err) => {
              console.error("Background save failed", err);
            });
          }
          return;
        }
        fullResponse += decoder.decode(value, { stream: true });
        controller.enqueue(value);
        pump();
      };
      pump().catch((error) => controller.error(error));
    },
  });

  return new Response(stream, { headers: response.headers });
}

export async function POST(req: Request) {
  let modelId: ModelId = "gpt-4o-mini";

  try {
    const session = await getSession();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      messages: UIMessage[];
      modelId?: ModelId;
      threadId?: string;
      resourceId?: string;
    };

    modelId = body.modelId ?? "gpt-4o-mini";
    const agent = createAssistantAgent(modelId);
    const { threadId } = body;
    const resourceId = body.resourceId ?? session.user.id;

    if (threadId) {
      const lastUserMessage = body.messages.at(-1);
      if (lastUserMessage?.role === "user") {
        const textContent =
          lastUserMessage.parts
            ?.filter((p) => p.type === "text")
            .map((p) => (p as { type: "text"; text: string }).text)
            .join("") ?? "";
        saveMessageToMemory(threadId, resourceId, "user", textContent).catch(
          (err) => {
            console.error("Background save failed", err);
          },
        );
      }
    }

    const response = await createAgentUIStreamResponse({
      agent,
      uiMessages: body.messages,
    });

    if (threadId) {
      return createStreamWithPersistence(response, threadId, resourceId);
    }

    return response;
  } catch (error) {
    console.error("Mastra chat API error", error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        code: "UnknownError",
      },
      { status: 500 },
    );
  }
}
