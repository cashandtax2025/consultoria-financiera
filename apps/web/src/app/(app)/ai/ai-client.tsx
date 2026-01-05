"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type FileUIPart, type ToolUIPart } from "ai";
import {
  Calculator,
  ChevronDown,
  Clock,
  Cloud,
  Eye,
  ImageIcon,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import {
  Message,
  MessageAttachment,
  MessageAttachments,
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
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  supportsVision?: boolean;
}[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Más capaz, mejor razonamiento",
    supportsVision: true,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Rápido y económico",
    supportsVision: true,
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    description: "Excelente en código y análisis",
    supportsVision: true,
  },
  {
    id: "claude-3-5-haiku-latest",
    name: "Claude Haiku",
    provider: "anthropic",
    description: "Ultra rápido",
    supportsVision: true,
  },
  {
    id: "gemini-3.0-flash",
    name: "Gemini 3.0 Flash",
    provider: "google",
    description: "Multimodal, muy rápido",
    supportsVision: true,
  } as const,
];

const suggestions = [
  "¿Cómo puedo mejorar mi flujo de caja?",
  "Analiza mis gastos del último trimestre",
  "¿Qué métricas financieras debo monitorear?",
  "Explica la diferencia entre EBITDA y beneficio neto",
];

const availableTools = [
  { icon: Cloud, name: "Clima", description: "Consultar el tiempo" },
  {
    icon: Calculator,
    name: "Calculadora",
    description: "Operaciones matemáticas",
  },
  { icon: Clock, name: "Hora", description: "Hora en cualquier zona" },
  { icon: ImageIcon, name: "Imágenes", description: "Analizar imágenes" },
];

function AttachmentButton() {
  const { openFileDialog } = usePromptInputAttachments();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <PromptInputButton onClick={openFileDialog}>
            <ImageIcon className="size-4" />
          </PromptInputButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Adjuntar imagen</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function AIClient() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] =
    useState<ModelId>("gemini-3.0-flash");
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

  const handleSubmit = ({
    text,
    files,
  }: {
    text: string;
    files: FileUIPart[];
  }) => {
    if (!text.trim() && files.length === 0) {
      return;
    }

    sendMessage({
      text,
      files,
    });
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const currentModel = models.find((m) => m.id === selectedModel) ?? {
    id: "gemini-3.0-flash" as const,
    name: "Gemini 3.0 Flash",
    provider: "google" as const,
    description: "Multimodal, muy rápido",
    supportsVision: true,
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent>
          {messages.length === 0 && (
            <div className="flex size-full flex-col items-center justify-center gap-8 p-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/5">
                  <Sparkles className="size-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-xl">
                    ¡Hola! Soy tu asistente financiero
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <TooltipProvider>
                  {availableTools.map((tool) => (
                    <Tooltip key={tool.name}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-colors hover:bg-accent">
                          <tool.icon className="size-5 text-muted-foreground" />
                          <span className="font-medium text-sm">
                            {tool.name}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tool.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>

              <div className="w-full max-w-2xl">
                <p className="mb-3 text-center text-muted-foreground text-sm">
                  Prueba con alguna de estas sugerencias:
                </p>
                <Suggestions className="justify-center">
                  {suggestions.map((suggestion) => (
                    <Suggestion
                      key={suggestion}
                      onClick={handleSuggestionClick}
                      suggestion={suggestion}
                    />
                  ))}
                </Suggestions>
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

                if (part.type === "file") {
                  const filePart = part as FileUIPart;
                  return (
                    <Message from={message.role} key={`${message.id}-${i}`}>
                      <MessageAttachments>
                        <MessageAttachment data={filePart} />
                      </MessageAttachments>
                    </Message>
                  );
                }

                if (part.type?.startsWith("tool-")) {
                  const toolPart = part as ToolUIPart;
                  return (
                    <Tool key={`${message.id}-${i}`}>
                      <ToolHeader
                        className="cursor-pointer"
                        state={toolPart.state || "output-available"}
                        type={toolPart.type}
                      />
                      <ToolContent>
                        <ToolInput input={toolPart.input || {}} />
                        <ToolOutput
                          errorText={toolPart.errorText}
                          output={toolPart.output}
                        />
                      </ToolContent>
                    </Tool>
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

          <ConversationScrollButton />
        </ConversationContent>
      </Conversation>

      <PromptInput
        accept="image/*"
        className="mt-4 shrink-0"
        multiple
        onSubmit={handleSubmit}
      >
        <PromptInputHeader>
          <PromptInputAttachments>
            {(attachment) => (
              <PromptInputAttachment data={attachment} key={attachment.id} />
            )}
          </PromptInputAttachments>
        </PromptInputHeader>
        <PromptInputBody>
          <PromptInputTextarea
            disabled={status !== "ready"}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje o arrastra una imagen..."
            value={input}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <AttachmentButton />

            <ModelSelector
              onOpenChange={setModelSelectorOpen}
              open={modelSelectorOpen}
            >
              <ModelSelectorTrigger asChild>
                <Button className="gap-2" size="sm" variant="ghost">
                  <ModelSelectorLogo provider={currentModel.provider} />
                  <span className="hidden sm:inline">{currentModel.name}</span>
                  {currentModel.supportsVision && (
                    <Badge
                      className="hidden gap-1 px-1.5 py-0 text-[10px] md:flex"
                      variant="secondary"
                    >
                      <Eye className="size-3" />
                    </Badge>
                  )}
                  <ChevronDown className="size-3 opacity-50" />
                </Button>
              </ModelSelectorTrigger>
              <ModelSelectorContent title="Seleccionar modelo">
                <ModelSelectorInput placeholder="Buscar modelo..." />
                <ModelSelectorList>
                  <ModelSelectorEmpty>
                    No se encontraron modelos
                  </ModelSelectorEmpty>
                  <ModelSelectorGroup heading="Google">
                    {models
                      .filter((m) => m.provider === "google")
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
                          {model.supportsVision && (
                            <Eye className="ml-auto size-3 text-muted-foreground" />
                          )}
                        </ModelSelectorItem>
                      ))}
                  </ModelSelectorGroup>
                  <ModelSelectorGroup heading="OpenAI">
                    {models
                      .filter((m) => m.provider === "openai")
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
                          {model.supportsVision && (
                            <Eye className="ml-auto size-3 text-muted-foreground" />
                          )}
                        </ModelSelectorItem>
                      ))}
                  </ModelSelectorGroup>
                  <ModelSelectorGroup heading="Anthropic">
                    {models
                      .filter((m) => m.provider === "anthropic")
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
                          {model.supportsVision && (
                            <Eye className="ml-auto size-3 text-muted-foreground" />
                          )}
                        </ModelSelectorItem>
                      ))}
                  </ModelSelectorGroup>
                </ModelSelectorList>
              </ModelSelectorContent>
            </ModelSelector>

            {messages.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleClearChat}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Limpiar chat</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </PromptInputTools>

          <PromptInputSubmit disabled={status !== "ready"} status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
