import {
  convertToModelMessages,
  smoothStream,
  streamText,
  type UIMessage,
} from 'ai';
import { SYSTEM_PROMPT } from '@/lib/chat/system-prompt';
import { handleToolGeneration } from '@/lib/chat/tool-handlers';
import { tools } from '@/lib/chat/tools';

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    threadId,
    userId,
  }: { messages: UIMessage[]; threadId?: string; userId?: string } =
    await req.json();

  // Skip saving tool data in API route - we'll handle it in the frontend
  // where we have access to real threadId and userId

  const result = streamText({
    model: 'google/gemini-2.0-flash',
    system: SYSTEM_PROMPT,
    messages: [...convertToModelMessages(messages)],
    toolChoice: 'auto',
    tools: {
      create_function_graph: {
        description: tools.create_function_graph.description,
        inputSchema: tools.create_function_graph.parameters,
        execute: async (params) => {
          return await handleToolGeneration('create_function_graph', params, userId);
        },
      },
      create_bar_chart: {
        description: tools.create_bar_chart.description,
        inputSchema: tools.create_bar_chart.parameters,
        execute: async (params) => {
          return await handleToolGeneration('create_bar_chart', params, userId);
        },
      },
      create_line_chart: {
        description: tools.create_line_chart.description,
        inputSchema: tools.create_line_chart.parameters,
        execute: async (params) => {
          return await handleToolGeneration('create_line_chart', params, userId);
        },
      },
      create_scatter_plot: {
        description: tools.create_scatter_plot.description,
        inputSchema: tools.create_scatter_plot.parameters,
        execute: async (params) => {
          return await handleToolGeneration('create_scatter_plot', params, userId);
        },
      },
      create_histogram: {
        description: tools.create_histogram.description,
        inputSchema: tools.create_histogram.parameters,
        execute: async (params) => {
          return await handleToolGeneration('create_histogram', params, userId);
        },
      },
      create_polar_graph: {
        description: tools.create_polar_graph.description,
        inputSchema: tools.create_polar_graph.parameters,
        execute: async (params) => {
          return await handleToolGeneration('create_polar_graph', params, userId);
        },
      },
      create_parametric_graph: {
        description: tools.create_parametric_graph.description,
        inputSchema: tools.create_parametric_graph.parameters,
        execute: async (params) => {
          return await handleToolGeneration('create_parametric_graph', params, userId);
        },
      },
      analyze_data: {
        description: tools.analyze_data.description,
        inputSchema: tools.analyze_data.parameters,
        execute: async (params) => {
          return await handleToolGeneration('analyze_data', params, userId);
        },
      },
      create_step_by_step: {
        description: tools.create_step_by_step.description,
        inputSchema: tools.create_step_by_step.parameters,
        execute: async (params) => {
          return await handleToolGeneration('create_step_by_step', params, userId);
        },
      },
      create_flashcards: {
        description: tools.create_flashcards.description,
        inputSchema: tools.create_flashcards.parameters,
        execute: async (params) => {
          return await handleToolGeneration('create_flashcards', params, userId);
        },
      },
      create_practice_test: {
        description: tools.create_practice_test.description,
        inputSchema: tools.create_practice_test.parameters,
        execute: async (params) => {
          return await handleToolGeneration('create_practice_test', params, userId);
        },
      },
      create_study_guide: {
        description: tools.create_study_guide.description,
        inputSchema: tools.create_study_guide.parameters,
        execute: async (params) => {
          return await handleToolGeneration('create_study_guide', params, userId);
        },
      },
    },
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: 'word',
    }),
  });

  return result.toUIMessageStreamResponse();
}
