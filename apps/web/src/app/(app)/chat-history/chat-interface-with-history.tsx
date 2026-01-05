"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  ChevronDown,
  MessageSquare,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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

interface Thread {
  id: string;
  resourceId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const suggestions = [
  "¿Qué tiempo hace en Madrid?",
  "¿Cuánto es 15% de 250?",
  "¿Qué hora es en Nueva York?",
  "Explícame qué es TypeScript",
];

export function ChatInterfaceWithHistory() {
  const [selectedModel, setSelectedModel] = useState<ModelId>("gpt-4o-mini");
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/mastra/chat",
        body: {
          modelId: selectedModel,
          threadId: currentThreadId,
        },
      }),
    [selectedModel, currentThreadId],
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    id: currentThreadId ?? "new-chat",
    transport,
  });

  useEffect(() => {
    if (pendingMessage && currentThreadId) {
      sendMessage({ text: pendingMessage });
      setPendingMessage(null);
    }
  }, [currentThreadId, pendingMessage, sendMessage]);

  const loadThreads = useCallback(async () => {
    try {
      const res = await fetch("/api/mastra/threads");
      if (res.ok) {
        const data = (await res.json()) as { threads: Thread[] };
        setThreads(data.threads ?? []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingThreads(false);
    }
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const loadThreadMessages = useCallback(
    async (threadId: string) => {
      setIsLoadingMessages(true);
      try {
        const res = await fetch(`/api/mastra/threads/${threadId}/messages`);
        if (res.ok) {
          const data = (await res.json()) as {
            messages: Array<{
              id: string;
              role: "user" | "assistant";
              content: string;
            }>;
          };
          setMessages(
            data.messages.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              parts: [{ type: "text" as const, text: m.content }],
            })),
          );
        }
      } catch {
        // ignore
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [setMessages],
  );

  const handleNewChat = async () => {
    try {
      const res = await fetch("/api/mastra/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Nueva conversación" }),
      });
      if (res.ok) {
        const data = (await res.json()) as { thread: Thread };
        setThreads((prev) => [data.thread, ...prev]);
        setCurrentThreadId(data.thread.id);
        setMessages([]);
      } else {
        toast.error("Error al crear la conversación");
      }
    } catch {
      toast.error("Error al crear la conversación");
    }
  };

  const handleSelectThread = async (threadId: string) => {
    if (threadId === currentThreadId) return;
    setCurrentThreadId(threadId);
    await loadThreadMessages(threadId);
  };

  const handleDeleteThread = async (threadId: string) => {
    setDeletingThreadId(threadId);
    try {
      const res = await fetch(`/api/mastra/threads/${threadId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setThreads((prev) => prev.filter((t) => t.id !== threadId));
        if (currentThreadId === threadId) {
          setCurrentThreadId(null);
          setMessages([]);
        }
        toast.success("Conversación eliminada");
      } else {
        toast.error("Error al eliminar la conversación");
      }
    } catch {
      toast.error("Error al eliminar la conversación");
    } finally {
      setDeletingThreadId(null);
    }
  };

  const handleSubmit = async ({ text }: { text: string }) => {
    if (!text.trim()) return;

    if (!currentThreadId) {
      const res = await fetch("/api/mastra/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: text.slice(0, 50) || "Nueva conversación",
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { thread: Thread };
        setThreads((prev) => [data.thread, ...prev]);
        setPendingMessage(text);
        setCurrentThreadId(data.thread.id);
      }
      return;
    }

    sendMessage({ text });
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit({ text: suggestion });
  };

  return (
    <div className="flex min-h-0 flex-1 gap-4">
      {/* Sidebar */}
      <div className="flex w-64 shrink-0 flex-col overflow-hidden rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium text-sm">Conversaciones</h3>
          <Button onClick={handleNewChat} size="icon" variant="ghost">
            <Plus className="size-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoadingThreads && (
              <div className="flex items-center justify-center py-8">
                <Loader className="text-muted-foreground" size={20} />
              </div>
            )}
            {!isLoadingThreads && threads.length === 0 && (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No hay conversaciones
              </div>
            )}
            {!isLoadingThreads && threads.length > 0 && (
              <div className="space-y-1">
                {threads.map((thread) => (
                  <div
                    className={`flex items-center gap-1 rounded-md pr-1 transition-colors hover:bg-accent ${
                      currentThreadId === thread.id ? "bg-accent" : ""
                    } ${deletingThreadId === thread.id ? "pointer-events-none opacity-50" : ""}`}
                    key={thread.id}
                  >
                    <button
                      className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left"
                      disabled={deletingThreadId === thread.id}
                      onClick={() => handleSelectThread(thread.id)}
                      type="button"
                    >
                      <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                      <span
                        className="block max-w-[160px] truncate text-sm"
                        title={thread.title}
                      >
                        {thread.title}
                      </span>
                    </button>
                    <button
                      className="shrink-0 rounded p-1.5 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none"
                      disabled={deletingThreadId === thread.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteThread(thread.id);
                      }}
                      type="button"
                    >
                      {deletingThreadId === thread.id ? (
                        <Loader className="size-4" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat */}
      <div className="flex min-h-0 flex-1 flex-col">
        <ScrollArea className="min-h-0 flex-1 pr-4">
          <div className="space-y-4 pb-4">
            {isLoadingMessages && (
              <div className="flex size-full flex-col items-center justify-center gap-4 py-20">
                <Loader className="text-primary" size={32} />
                <p className="text-muted-foreground text-sm">
                  Cargando conversación...
                </p>
              </div>
            )}
            {!isLoadingMessages && messages.length === 0 && (
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

            {!isLoadingMessages &&
              messages.map((message) => (
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
                              <ModelSelectorName>
                                {model.name}
                              </ModelSelectorName>
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
            </PromptInputTools>
            <PromptInputSubmit disabled={status !== "ready"} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
