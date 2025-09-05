import { 
  FunctionGraph, 
  BarChart, 
  LineChart, 
  ScatterPlot, 
  Histogram, 
  PolarGraph, 
  ParametricGraph,
  StepByStep,
  Flashcard,
  FlashcardCard
} from './tools';

function parseExpression(expression: string, variable: string): (x: number) => number {
  let processed = expression
    .replace(/\^/g, '**') // Power operator
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/log\(/g, 'Math.log(')
    .replace(/ln\(/g, 'Math.log(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/exp\(/g, 'Math.exp(')
    .replace(/pi/g, 'Math.PI')
    .replace(/e/g, 'Math.E');
  
  processed = processed.replace(/(\d+)([a-zA-Z])/g, '$1*$2');
  processed = processed.replace(/([a-zA-Z])(\d+)/g, '$1*$2');
  processed = processed.replace(/([a-zA-Z])([a-zA-Z])/g, '$1*$2');
  

  return (x: number) => {
    try {
      const func = new Function(variable, `return ${processed}`);
      return func(x);
    } catch (error) {
      throw new Error(`Invalid mathematical expression: ${expression}`);
    }
  };
}

export function evaluateFunction(expression: string, variable: string, x: number): number {
  const func = parseExpression(expression, variable);
  return func(x);
}

export function generateFunctionData(
  expression: string, 
  variable: string, 
  min: number, 
  max: number, 
  step: number
): Array<{ x: number; y: number }> {
  const data: Array<{ x: number; y: number }> = [];
  const func = parseExpression(expression, variable);
  
  for (let x = min; x <= max; x += step) {
    try {
      const y = func(x);
      if (isFinite(y)) {
        data.push({ x, y });
      }
    } catch (error) {
      continue;
    }
  }
  return data;
}

export function generatePolarData(
  expression: string, 
  variable: string, 
  min: number, 
  max: number, 
  step: number
): Array<{ x: number; y: number }> {
  const data: Array<{ x: number; y: number }> = [];
  const func = parseExpression(expression, variable);
  
  for (let theta = min; theta <= max; theta += step) {
    try {
      const r = func(theta);
      if (isFinite(r) && r >= 0) {
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        data.push({ x, y });
      }
    } catch (error) {
      continue;
    }
  }
  
  return data;
}

export function generateParametricData(
  xExpression: string, 
  yExpression: string, 
  variable: string, 
  min: number, 
  max: number, 
  step: number
): Array<{ x: number; y: number }> {
  const data: Array<{ x: number; y: number }> = [];
  const xFunc = parseExpression(xExpression, variable);
  const yFunc = parseExpression(yExpression, variable);
  
  for (let t = min; t <= max; t += step) {
    try {
      const x = xFunc(t);
      const y = yFunc(t);
      if (isFinite(x) && isFinite(y)) {
        data.push({ x, y });
      }
    } catch (error) {
      continue;
    }
  }
  
  return data;
}

export function generateFunctionChart(graph: FunctionGraph) {
  const { expression, variable, domain } = graph;
  const { min = -10, max = 10, step = 0.1 } = domain || {};
  
  const data = generateFunctionData(expression, variable, min, max, step);
  
  return {
    type: 'function',
    data,
    config: graph.config,
    metadata: {
      expression,
      variable,
      domain: { min, max, step }
    }
  };
}

export function generateBarChart(graph: BarChart) {
  return {
    type: 'bar',
    data: graph.data,
    config: graph.config,
    metadata: {
      dataPoints: graph.data.length
    }
  };
}

export function generateLineChart(graph: LineChart) {
  return {
    type: 'line',
    data: graph.data,
    config: graph.config,
    metadata: {
      dataPoints: graph.data.length
    }
  };
}

export function generateScatterPlot(graph: ScatterPlot) {
  return {
    type: 'scatter',
    data: graph.data,
    config: graph.config,
    metadata: {
      dataPoints: graph.data.length
    }
  };
}

export function generateHistogram(graph: Histogram) {
  const { data, bins = 10 } = graph;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / bins;
  
  const histogramData = Array.from({ length: bins }, (_, i) => {
    const binStart = min + i * binWidth;
    const binEnd = min + (i + 1) * binWidth;
    const count = data.filter(value => value >= binStart && value < binEnd).length;
    
    return {
      x: (binStart + binEnd) / 2,
      y: count,
      label: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`
    };
  });

  return {
    type: 'histogram',
    data: histogramData,
    config: graph.config,
    metadata: {
      bins,
      binWidth,
      dataPoints: data.length
    }
  };
}

export function generatePolarGraph(graph: PolarGraph) {
  const { expression, variable, domain } = graph;
  const { min = 0, max = 2 * Math.PI, step = 0.1 } = domain || {};
  
  const data = generatePolarData(expression, variable, min, max, step);
  
  return {
    type: 'polar',
    data,
    config: graph.config,
    metadata: {
      expression,
      variable,
      domain: { min, max, step }
    }
  };
}

export function generateParametricGraph(graph: ParametricGraph) {
  const { xExpression, yExpression, variable, domain } = graph;
  const { min = 0, max = 10, step = 0.1 } = domain || {};
  
  const data = generateParametricData(xExpression, yExpression, variable, min, max, step);
  
  return {
    type: 'parametric',
    data,
    config: graph.config,
    metadata: {
      xExpression,
      yExpression,
      variable,
      domain: { min, max, step }
    }
  };
}

export function generateSteps(stepByStep: StepByStep): StepByStep {
  return {
    type: 'step-by-step',
    problem: stepByStep.problem || 'Mathematical problem to be solved',
    method: stepByStep.method || 'Step-by-step solution method',
    steps: stepByStep.steps || [
      {
        stepNumber: 1,
        description: 'Identify the problem and approach',
        equation: 'Problem setup',
        tip: 'Start by understanding what needs to be solved'
      },
      {
        stepNumber: 2,
        description: 'Apply the appropriate method',
        equation: 'Working through the solution',
        tip: 'Use the correct mathematical technique'
      },
      {
        stepNumber: 3,
        description: 'Verify and finalize the solution',
        equation: 'Final answer',
        tip: 'Check your work and present the solution clearly'
      }
    ],
    solution: stepByStep.solution || 'Solution will be provided'
  };
}

export function generateFlashcards(flashcard: Flashcard): Flashcard {
  return flashcard;
}

export async function handleGraphTool(toolName: string, parameters: any) {
  try {
    let result;
    switch (toolName) {
      case 'create_function_graph':
        result = generateFunctionChart(parameters as FunctionGraph);
        break;
      
      case 'create_bar_chart':
        result = generateBarChart(parameters as BarChart);
        break;
      
      case 'create_line_chart':
        result = generateLineChart(parameters as LineChart);
        break;
      
      case 'create_scatter_plot':
        result = generateScatterPlot(parameters as ScatterPlot);
        break;
      
      case 'create_histogram':
        result = generateHistogram(parameters as Histogram);
        break;
      
      case 'create_polar_graph':
        result = generatePolarGraph(parameters as PolarGraph);
        break;
      
      case 'create_parametric_graph':
        result = generateParametricGraph(parameters as ParametricGraph);
        break;
      
      case 'analyze_data':
        result = analyzeData(parameters.data, parameters.analysisType);
        break;
      
      case 'create_step_by_step':
        result = generateSteps(parameters as StepByStep);
        break;
      
      case 'create_flashcards':
        result = generateFlashcards(parameters as Flashcard);
        break;
      
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
    
    return result;
  } catch (error) {
    throw new Error(`Error executing ${toolName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function analyzeData(data: any[], analysisType?: string) {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      suggestion: 'No data provided',
      recommendedCharts: []
    };
  }

  const numericData = data.filter(item => typeof item === 'number');
  const isNumeric = numericData.length === data.length;
  
  const suggestions = [];
  const recommendedCharts = [];

  if (isNumeric) {
    // Numeric data analysis
    const mean = numericData.reduce((a, b) => a + b, 0) / numericData.length;
    const variance = numericData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numericData.length;
    const stdDev = Math.sqrt(variance);
    
    suggestions.push(`Mean: ${mean.toFixed(2)}`);
    suggestions.push(`Standard Deviation: ${stdDev.toFixed(2)}`);
    
    if (analysisType === 'distribution' || !analysisType) {
      recommendedCharts.push('histogram');
    }
    if (analysisType === 'trend' || !analysisType) {
      recommendedCharts.push('line');
    }
  } else {
    // Categorical or mixed data
    const uniqueValues = [...new Set(data)];
    suggestions.push(`Unique values: ${uniqueValues.length}`);
    
    if (analysisType === 'comparison' || !analysisType) {
      recommendedCharts.push('bar');
    }
  }

  return {
    suggestions,
    recommendedCharts,
    dataSummary: {
      totalPoints: data.length,
      isNumeric,
      uniqueValues: isNumeric ? undefined : [...new Set(data)].length
    }
  };
}
