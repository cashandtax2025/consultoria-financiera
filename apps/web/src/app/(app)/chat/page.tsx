import type { Metadata } from "next";
import { ChatInterface } from "./chat-interface";

export const metadata: Metadata = {
  title: "Chat con IA",
  description: "Chatea con nuestro asistente de inteligencia artificial.",
};

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <div className="mb-4 shrink-0">
        <h1 className="font-bold text-3xl">Chat con IA</h1>
        <p className="mt-2 text-muted-foreground">
          Chat simple sin persistencia de historial
        </p>
      </div>

      <ChatInterface />
    </div>
  );
}
