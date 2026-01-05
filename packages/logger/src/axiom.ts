import { Axiom } from "@axiomhq/js";

let axiomClient: Axiom | null = null;

export function getAxiomClient(): Axiom | null {
  if (axiomClient) return axiomClient;

  const token = process.env.AXIOM_TOKEN;
  if (!token) return null;

  axiomClient = new Axiom({ token });
  return axiomClient;
}

export async function flushAxiom(): Promise<void> {
  if (axiomClient) {
    await axiomClient.flush();
  }
}
