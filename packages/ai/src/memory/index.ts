import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

let storeInstance: PostgresStore | null = null;
let memoryInstance: Memory | null = null;

export function initMemory(connectionString: string): void {
  if (!storeInstance) {
    storeInstance = new PostgresStore({
      id: "mastra-memory",
      connectionString,
      schemaName: "mastra",
    });
  }

  if (!memoryInstance) {
    memoryInstance = new Memory({
      storage: storeInstance,
    });
  }
}

export function getMemory(): Memory {
  if (!memoryInstance) {
    throw new Error("Memory not initialized. Call initMemory first.");
  }
  return memoryInstance;
}

export function getStore(): PostgresStore {
  if (!storeInstance) {
    throw new Error("Store not initialized. Call initMemory first.");
  }
  return storeInstance;
}

export { Memory } from "@mastra/memory";
export { PostgresStore } from "@mastra/pg";
