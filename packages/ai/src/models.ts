import { gateway } from "@ai-sdk/gateway";

export type ModelId =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "claude-sonnet-4-20250514"
  | "claude-3-5-haiku-latest"
  | "gemini-3.0-flash";

export function getModel(modelId: ModelId) {
  switch (modelId) {
    case "gpt-4o":
      return gateway("openai/gpt-4o");
    case "gpt-4o-mini":
      return gateway("openai/gpt-4o-mini");
    case "claude-sonnet-4-20250514":
      return gateway("anthropic/claude-sonnet-4-20250514");
    case "claude-3-5-haiku-latest":
      return gateway("anthropic/claude-3-5-haiku-latest");
    case "gemini-3.0-flash":
      return gateway("google/gemini-3-flash");
    default:
      return gateway("openai/gpt-4o-mini");
  }
}

export const defaultModel = "gpt-4o-mini" satisfies ModelId;
