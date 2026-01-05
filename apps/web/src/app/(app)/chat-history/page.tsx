import type { Metadata } from "next";
import { ChatInterfaceWithHistory } from "./chat-interface-with-history";

export const metadata: Metadata = {
  title: "Chat con Historial",
  description: "Chat con IA con persistencia de conversaciones usando Mastra.",
};

export default function ChatHistoryPage() {
  return (
    <div className="relative flex h-[calc(100vh-7rem)] flex-col">
      <div className="mb-4 shrink-0">
        <h1 className="font-bold text-3xl">Chat con Historial</h1>
        <p className="mt-2 text-muted-foreground">
          Conversaciones persistentes con Mastra Memory
        </p>
      </div>

      <ChatInterfaceWithHistory />
    </div>
  );
}
