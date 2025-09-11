import { z } from 'zod';

// Graph types schema
export const GraphTypeSchema = z.enum([
  'function',
  'bar',
  'line',
  'scatter',
  'histogram',
  'box',
  'polar',
  'parametric',
  'vector-field',
  'contour',
]);

export const ChartConfigSchema = z.object({
  title: z.string().optional(),
  xLabel: z.string().optional(),
  yLabel: z.string().optional(),
  xMin: z.number().optional(),
  xMax: z.number().optional(),
  yMin: z.number().optional(),
  yMax: z.number().optional(),
  grid: z.boolean().default(true),
  legend: z.boolean().default(true),
  colors: z.array(z.string()).optional(),
});

// Function graph schema
export const FunctionGraphSchema = z.object({
  type: z.literal('function'),
  expression: z
    .string()
    .describe(
      'Mathematical expression to plot (e.g., "x^2 + 2*x + 1", "sin(x)", "log(x)")'
    ),
  variable: z.string().default('x').describe('Variable name in the expression'),
  domain: z
    .object({
      min: z.number().default(-10),
      max: z.number().default(10),
      step: z.number().default(0.1),
    })
    .optional(),
  config: ChartConfigSchema.optional(),
});

// Statistical chart schemas
export const BarChartSchema = z.object({
  type: z.literal('bar'),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
    })
  ),
  config: ChartConfigSchema.optional(),
});

export const LineChartSchema = z.object({
  type: z.literal('line'),
  data: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
    })
  ),
  config: ChartConfigSchema.optional(),
});

export const ScatterPlotSchema = z.object({
  type: z.literal('scatter'),
  data: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
      label: z.string().optional(),
    })
  ),
  config: ChartConfigSchema.optional(),
});

export const HistogramSchema = z.object({
  type: z.literal('histogram'),
  data: z.array(z.number()),
  bins: z.number().default(10).optional(),
  config: ChartConfigSchema.optional(),
});

// Advanced math visualizations
export const PolarGraphSchema = z.object({
  type: z.literal('polar'),
  expression: z.string().describe('Polar equation (e.g., "r = 2*cos(theta)")'),
  variable: z.string().default('theta'),
  domain: z
    .object({
      min: z.number().default(0),
      max: z.number().default(2 * Math.PI),
      step: z.number().default(0.1),
    })
    .optional(),
  config: ChartConfigSchema.optional(),
});

export const ParametricGraphSchema = z.object({
  type: z.literal('parametric'),
  xExpression: z.string().describe('X component (e.g., "t*cos(t)")'),
  yExpression: z.string().describe('Y component (e.g., "t*sin(t)")'),
  variable: z.string().default('t'),
  domain: z
    .object({
      min: z.number().default(0),
      max: z.number().default(10),
      step: z.number().default(0.1),
    })
    .optional(),
  config: ChartConfigSchema.optional(),
});

// Union schema for all graph types
export const GraphSchema = z.discriminatedUnion('type', [
  FunctionGraphSchema,
  BarChartSchema,
  LineChartSchema,
  ScatterPlotSchema,
  HistogramSchema,
  PolarGraphSchema,
  ParametricGraphSchema,
]);

// Step-by-step explanation schema
export const StepSchema = z.object({
  stepNumber: z.number().describe('Step number (1, 2, 3, etc.)'),
  description: z
    .string()
    .describe('Short explanation of what happens in this step'),
  equation: z.string().describe('The equation or expression after this step'),
  tip: z
    .string()
    .optional()
    .describe('Optional helpful tip or rule for this step'),
  highlight: z
    .string()
    .optional()
    .describe('Optional highlighting for key changes'),
});

export const StepByStepSchema = z.object({
  type: z.literal('step-by-step'),
  problem: z.string().describe('The original problem or equation to solve'),
  method: z
    .string()
    .describe(
      'The solving method used (e.g., "factoring", "quadratic formula", "substitution")'
    ),
  steps: z.array(StepSchema).describe('Array of step-by-step explanations'),
  solution: z.string().describe('Final answer or solution'),
});

// Flashcard schemas
export const FlashcardCardSchema = z.object({
  id: z.string(),
  front: z.string().describe('Question or prompt on the front of the card'),
  back: z.string().describe('Answer or explanation on the back of the card'),
});

export const FlashcardSchema = z.object({
  type: z.literal('flashcards'),
  topic: z.string().describe('The subject or topic for the flashcards'),
  count: z
    .number()
    .min(1)
    .max(50)
    .describe('Number of flashcards to generate (1-50)'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('Difficulty level of the flashcards'),
  cards: z
    .array(FlashcardCardSchema)
    .describe(
      'Generated flashcard cards with questions and answers - REQUIRED: Generate the actual card content'
    ),
});

// Practice test schemas
export const PracticeTestQuestionSchema = z.object({
  id: z.string(),
  question: z.string().describe('The question text'),
  type: z
    .enum(['multiple-choice', 'true-false', 'fill-in-blank', 'short-answer'])
    .describe('Type of question'),
  options: z
    .array(z.string())
    .optional()
    .describe('Answer options for multiple choice questions'),
  correctAnswer: z.string().describe('The correct answer'),
  explanation: z
    .string()
    .optional()
    .describe('Explanation of the correct answer'),
  points: z.number().describe('Points awarded for correct answer'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('Difficulty level of the question'),
  tags: z.array(z.string()).describe('Tags for categorization'),
  timeLimit: z
    .number()
    .optional()
    .describe('Time limit for this question in seconds'),
});

export const PracticeTestSchema = z.object({
  type: z.literal('practice-test'),
  title: z.string().describe('Title of the practice test'),
  description: z
    .string()
    .optional()
    .describe('Description of what the test covers'),
  subject: z.string().describe('Subject area (e.g., "Algebra", "Calculus", "Geometry")'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('Overall difficulty level of the test'),
  questionCount: z
    .number()
    .min(1)
    .max(100)
    .describe('Number of questions in the test'),
  timeLimit: z
    .number()
    .optional()
    .describe('Total time limit for the test in minutes'),
  questions: z
    .array(PracticeTestQuestionSchema)
    .describe('Array of test questions - REQUIRED: Generate the actual questions'),
  settings: z
    .object({
      randomizeQuestions: z.boolean().default(true),
      showExplanations: z.boolean().default(true),
      allowRetake: z.boolean().default(true),
      showCorrectAnswers: z.boolean().default(true),
      timePerQuestion: z.number().optional(),
    })
    .optional()
    .describe('Test configuration settings'),
});

// Study guide schemas
export const StudyGuideStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['concept', 'example', 'practice', 'visualization']),
  content: z.object({
    explanation: z.string(),
    examples: z.array(z.string()).optional(),
    formulas: z.array(z.string()).optional(),
    visualizations: z.array(z.string()).optional(),
    practiceProblems: z.array(z.string()).optional(),
  }),
  prerequisites: z.array(z.string()),
  estimatedTime: z.number(),
  completed: z.boolean().optional(),
});

export const StudyGuideSchema = z.object({
  type: z.literal('study-guide'),
  title: z.string(),
  description: z.string().optional(),
  topic: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  learningPath: z.array(StudyGuideStepSchema),
  mermaidCode: z.string().optional(),
  estimatedTotalTime: z.number(),
});


// Tool definitions
export const tools = {
  create_function_graph: {
    description:
      'Create a mathematical function graph (linear, quadratic, trigonometric, exponential, etc.)',
    parameters: FunctionGraphSchema,
  },
  create_bar_chart: {
    description: 'Create a bar chart for data comparison',
    parameters: BarChartSchema,
  },
  create_line_chart: {
    description: 'Create a line chart for trend analysis',
    parameters: LineChartSchema,
  },
  create_scatter_plot: {
    description: 'Create a scatter plot for correlation analysis',
    parameters: ScatterPlotSchema,
  },
  create_histogram: {
    description: 'Create a histogram for distribution analysis',
    parameters: HistogramSchema,
  },
  create_polar_graph: {
    description: 'Create a polar coordinate graph',
    parameters: PolarGraphSchema,
  },
  create_parametric_graph: {
    description: 'Create a parametric equation graph',
    parameters: ParametricGraphSchema,
  },
  analyze_data: {
    description: 'Analyze data and suggest appropriate chart types',
    parameters: z.object({
      data: z.array(z.any()),
      analysisType: z
        .enum(['distribution', 'correlation', 'trend', 'comparison'])
        .optional(),
    }),
  },
  create_step_by_step: {
    description:
      'Create a step-by-step explanation for solving mathematical problems',
    parameters: StepByStepSchema,
  },
  create_flashcards: {
    description:
      'MANDATORY: Generate flashcards for studying a specific topic with customizable difficulty and count. You MUST generate the actual card content (front and back) for each flashcard. Use this tool for ANY flashcard request - never return flashcards as text.',
    parameters: FlashcardSchema,
  },
  create_practice_test: {
    description:
      'MANDATORY: Generate a practice test for a specific math topic with customizable difficulty, question count, and question types. You MUST generate the actual questions with correct answers and explanations. Use this tool for ANY practice test request - never return test content as text.',
    parameters: PracticeTestSchema,
  },
  create_study_guide: {
    description:
      'MANDATORY: Generate a comprehensive study guide with learning path, Mermaid flowchart, and step-by-step content for any math topic. You MUST generate the actual learning path with detailed content, examples, and practice problems. Each step MUST include a complete content object with explanation (required), examples, formulas, practiceProblems, and visualizations arrays filled with actual mathematical content. You MUST ALWAYS include a mermaidCode string with proper Mermaid flowchart syntax. Use this tool for ANY study guide request - never return study guide content as text.',
    parameters: StudyGuideSchema,
  },
};

export type GraphType = z.infer<typeof GraphTypeSchema>;
export type ChartConfig = z.infer<typeof ChartConfigSchema>;
export type FunctionGraph = z.infer<typeof FunctionGraphSchema>;
export type BarChart = z.infer<typeof BarChartSchema>;
export type LineChart = z.infer<typeof LineChartSchema>;
export type ScatterPlot = z.infer<typeof ScatterPlotSchema>;
export type Histogram = z.infer<typeof HistogramSchema>;
export type PolarGraph = z.infer<typeof PolarGraphSchema>;
export type ParametricGraph = z.infer<typeof ParametricGraphSchema>;
export type Graph = z.infer<typeof GraphSchema>;
export type Step = z.infer<typeof StepSchema>;
export type StepByStep = z.infer<typeof StepByStepSchema>;
export type Flashcard = z.infer<typeof FlashcardSchema>;
export type FlashcardCard = z.infer<typeof FlashcardCardSchema>;
export type PracticeTestQuestion = z.infer<typeof PracticeTestQuestionSchema>;
export type PracticeTest = z.infer<typeof PracticeTestSchema>;
export type StudyGuideStep = z.infer<typeof StudyGuideStepSchema>;
export type StudyGuide = z.infer<typeof StudyGuideSchema>;
