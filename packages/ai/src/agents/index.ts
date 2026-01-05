import { ToolLoopAgent } from "ai";
import { defaultModel, getModel, type ModelId } from "../models";
import { calculatorTool, currentTimeTool, weatherTool } from "../tools";

const assistantInstructions = `Eres un asistente útil especializado en consultoría financiera.
Ayudas con preguntas de contabilidad, análisis financiero y consultoría empresarial.
Responde en español a menos que el usuario escriba en otro idioma.
Sé profesional, preciso y proporciona consejos accionables.
Tienes acceso a herramientas para obtener el clima, hacer cálculos y obtener la hora actual.`;

const codeInstructions = `Eres un asistente experto en programación para aplicaciones financieras.
Ayudas con código, debugging, arquitectura y mejores prácticas.
Responde en español a menos que el usuario escriba en otro idioma.
Proporciona ejemplos de código cuando sea útil.
Prioriza la corrección y seguridad del código.`;

export function createAssistantAgent(modelId: ModelId = defaultModel) {
  return new ToolLoopAgent({
    model: getModel(modelId),
    instructions: assistantInstructions,
    tools: {
      weather: weatherTool,
      calculator: calculatorTool,
      currentTime: currentTimeTool,
    },
  });
}

export function createCodeAgent(modelId: ModelId = "gpt-4o") {
  return new ToolLoopAgent({
    model: getModel(modelId),
    instructions: codeInstructions,
    tools: {
      calculator: calculatorTool,
    },
  });
}

export const assistantAgent = createAssistantAgent();
export const codeAgent = createCodeAgent();
