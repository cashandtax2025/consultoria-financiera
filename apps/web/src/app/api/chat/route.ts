import { gateway } from "@ai-sdk/gateway";
import {
  calculatorTool,
  currentTimeTool,
  getAvailableCategoriesTool,
  getClientAccountingStatusTool,
  getClientAccountMappingTool,
  getClientDetailsTool,
  getClientsStatsTool,
  listClientsTool,
  type ModelId,
} from "@consultoria-financiera/ai";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";

export const maxDuration = 60;

const SYSTEM_PROMPT = `Eres un asistente de consultoría financiera experto. Ayudas a los consultores a gestionar sus clientes y su información contable.

Tienes acceso a las siguientes herramientas:
- listClientsTool: Para listar y buscar clientes
- getClientDetailsTool: Para obtener detalles completos de un cliente específico
- getClientAccountingStatusTool: Para ver el estado del mapeo contable de un cliente
- getClientsStatsTool: Para obtener estadísticas generales de la cartera de clientes
- getClientAccountMappingTool: Para buscar mapeos de cuentas contables específicas
- getAvailableCategoriesTool: Para ver los sectores y tipos de empresa disponibles
- calculatorTool: Para realizar cálculos matemáticos
- currentTimeTool: Para obtener la fecha y hora actual

Responde siempre en español. Sé conciso pero completo en tus respuestas.
Cuando el usuario pregunte sobre clientes, usa las herramientas disponibles para obtener información actualizada de la base de datos.`;

export async function POST(req: Request) {
  const { messages, modelId }: { messages: UIMessage[]; modelId?: ModelId } =
    await req.json();

  const model = modelId
    ? gateway(`openai/${modelId}`)
    : gateway("openai/gpt-4o-mini");

  const result = streamText({
    model,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      listClients: listClientsTool,
      getClientDetails: getClientDetailsTool,
      getClientAccountingStatus: getClientAccountingStatusTool,
      getClientsStats: getClientsStatsTool,
      getClientAccountMapping: getClientAccountMappingTool,
      getAvailableCategories: getAvailableCategoriesTool,
      calculator: calculatorTool,
      currentTime: currentTimeTool,
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
