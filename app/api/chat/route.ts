import { streamText, UIMessage, convertToModelMessages, smoothStream } from 'ai';
import { tools } from '@/lib/tools';
import { handleGraphTool } from '@/lib/tool-handlers';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'google/gemini-2.0-flash',
    messages: [
      ...convertToModelMessages(messages)
    ],
    tools: {
      create_function_graph: {
        description: tools.create_function_graph.description,
        inputSchema: tools.create_function_graph.parameters,
        execute: async (params) => {
          return await handleGraphTool('create_function_graph', params);
        }
      },
      create_bar_chart: {
        description: tools.create_bar_chart.description,
        inputSchema: tools.create_bar_chart.parameters,
        execute: async (params) => {
          return await handleGraphTool('create_bar_chart', params);
        }
      },
      create_line_chart: {
        description: tools.create_line_chart.description,
        inputSchema: tools.create_line_chart.parameters,
        execute: async (params) => {
          return await handleGraphTool('create_line_chart', params);
        }
      },
      create_scatter_plot: {
        description: tools.create_scatter_plot.description,
        inputSchema: tools.create_scatter_plot.parameters,
        execute: async (params) => {
          return await handleGraphTool('create_scatter_plot', params);
        }
      },
      create_histogram: {
        description: tools.create_histogram.description,
        inputSchema: tools.create_histogram.parameters,
        execute: async (params) => {
          return await handleGraphTool('create_histogram', params);
        }
      },
      create_polar_graph: {
        description: tools.create_polar_graph.description,
        inputSchema: tools.create_polar_graph.parameters,
        execute: async (params) => {
          return await handleGraphTool('create_polar_graph', params);
        }
      },
      create_parametric_graph: {
        description: tools.create_parametric_graph.description,
        inputSchema: tools.create_parametric_graph.parameters,
        execute: async (params) => {
          return await handleGraphTool('create_parametric_graph', params);
        }
      },
      analyze_data: {
        description: tools.analyze_data.description,
        inputSchema: tools.analyze_data.parameters,
        execute: async (params) => {
          return await handleGraphTool('analyze_data', params);
        }
      },
      create_step_by_step: {
        description: tools.create_step_by_step.description,
        inputSchema: tools.create_step_by_step.parameters,
        execute: async (params) => {
          return await handleGraphTool('create_step_by_step', params);
        }
      }
    },
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: 'word',
    }),
  });

  return result.toUIMessageStreamResponse();
}