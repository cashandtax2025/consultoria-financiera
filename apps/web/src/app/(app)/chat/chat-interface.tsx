"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChevronDown, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Loader } from "@/components/ai-elements/loader";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type ModelId =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "claude-sonnet-4-20250514"
  | "claude-3-5-haiku-latest"
  | "gemini-3.0-flash";

const models: {
  id: ModelId;
  name: string;
  provider: "openai" | "anthropic" | "google";
  description: string;
}[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Más capaz",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Rápido",
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    description: "Código",
  },
  {
    id: "claude-3-5-haiku-latest",
    name: "Claude Haiku",
    provider: "anthropic",
    description: "Ultra rápido",
  },
  {
    id: "gemini-3.0-flash",
    name: "Gemini Flash",
    provider: "google",
    description: "Multimodal",
  },
];

const suggestions = [
  "¿Qué tiempo hace en Madrid?",
  "¿Cuánto es 15% de 250?",
  "¿Qué hora es en Nueva York?",
  "Explícame qué es TypeScript",
];

export function ChatInterface() {
  const [selectedModel, setSelectedModel] = useState<ModelId>("gpt-4o-mini");
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { modelId: selectedModel },
      }),
    [selectedModel],
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "main-chat",
    transport,
  });

  const handleSubmit = ({ text }: { text: string }) => {
    if (!text.trim()) return;
    sendMessage({ text });
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1 pr-4">
        <div className="space-y-4 pb-4">
          {messages.length === 0 && (
            <div className="flex size-full flex-col items-center justify-center gap-8 p-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/5">
                  <Sparkles className="size-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-xl">
                    ¡Hola! Soy tu asistente
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              </div>

              <div className="w-full max-w-2xl">
                <p className="mb-3 text-center text-muted-foreground text-sm">
                  Prueba con alguna de estas sugerencias:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="rounded-full border bg-card px-4 py-2 text-sm transition-colors hover:bg-accent"
                      type="button"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id}>
              {message.parts?.map((part, i) => {
                if (part.type === "text") {
                  return (
                    <Message from={message.role} key={`${message.id}-${i}`}>
                      <MessageContent>
                        <MessageResponse>{part.text}</MessageResponse>
                      </MessageContent>
                    </Message>
                  );
                }
                return null;
              })}
            </div>
          ))}

          {status === "streaming" && (
            <Message from="assistant">
              <MessageContent>
                <Loader className="text-muted-foreground" size={20} />
              </MessageContent>
            </Message>
          )}
        </div>
      </ScrollArea>

      <PromptInput className="mt-4 shrink-0" onSubmit={handleSubmit}>
        <PromptInputTextarea
          disabled={status !== "ready"}
          placeholder="Escribe tu mensaje..."
        />
        <PromptInputFooter>
          <PromptInputTools>
            <ModelSelector
              onOpenChange={setModelSelectorOpen}
              open={modelSelectorOpen}
            >
              <ModelSelectorTrigger asChild>
                <Button className="gap-2" size="sm" variant="ghost">
                  <ModelSelectorLogo
                    provider={
                      models.find((m) => m.id === selectedModel)?.provider ??
                      "openai"
                    }
                  />
                  <span className="hidden sm:inline">
                    {models.find((m) => m.id === selectedModel)?.name}
                  </span>
                  <ChevronDown className="size-3 opacity-50" />
                </Button>
              </ModelSelectorTrigger>
              <ModelSelectorContent title="Seleccionar modelo">
                <ModelSelectorInput placeholder="Buscar modelo..." />
                <ModelSelectorList>
                  <ModelSelectorEmpty>
                    No se encontraron modelos
                  </ModelSelectorEmpty>
                  {["google", "openai", "anthropic"].map((provider) => (
                    <ModelSelectorGroup
                      heading={
                        provider.charAt(0).toUpperCase() + provider.slice(1)
                      }
                      key={provider}
                    >
                      {models
                        .filter((m) => m.provider === provider)
                        .map((model) => (
                          <ModelSelectorItem
                            key={model.id}
                            onSelect={() => {
                              setSelectedModel(model.id);
                              setModelSelectorOpen(false);
                            }}
                            value={model.id}
                          >
                            <ModelSelectorLogo provider={model.provider} />
                            <ModelSelectorName>{model.name}</ModelSelectorName>
                            <span className="text-muted-foreground text-xs">
                              {model.description}
                            </span>
                          </ModelSelectorItem>
                        ))}
                    </ModelSelectorGroup>
                  ))}
                </ModelSelectorList>
              </ModelSelectorContent>
            </ModelSelector>

            {messages.length > 0 && (
              <Button
                onClick={handleClearChat}
                size="icon"
                variant="ghost"
                type="button"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </PromptInputTools>

          <PromptInputSubmit disabled={status !== "ready"} status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
