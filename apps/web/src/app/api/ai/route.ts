import { gateway } from "@ai-sdk/gateway";
import type { ModelId } from "@consultoria-financiera/ai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, modelId }: { messages: UIMessage[]; modelId?: ModelId } =
    await req.json();

  const model = modelId
    ? gateway(`openai/${modelId}`)
    : gateway("openai/gpt-4o-mini");

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
