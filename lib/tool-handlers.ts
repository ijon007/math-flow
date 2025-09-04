import { 
  Graph, 
  FunctionGraph, 
  BarChart, 
  LineChart, 
  ScatterPlot, 
  Histogram, 
  PolarGraph, 
  ParametricGraph,
  ChartConfig,
  StepByStep,
  Step
} from './tools';

// Math expression parser and evaluator
export class MathParser {
  private static parseExpression(expression: string, variable: string): (x: number) => number {
    // Replace common math functions and operators
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
    
    // Handle implicit multiplication (e.g., 2x -> 2*x)
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

  static evaluateFunction(expression: string, variable: string, x: number): number {
    const func = this.parseExpression(expression, variable);
    return func(x);
  }

  static generateFunctionData(
    expression: string, 
    variable: string, 
    min: number, 
    max: number, 
    step: number
  ): Array<{ x: number; y: number }> {
    const data: Array<{ x: number; y: number }> = [];
    const func = this.parseExpression(expression, variable);
    
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

  static generatePolarData(
    expression: string, 
    variable: string, 
    min: number, 
    max: number, 
    step: number
  ): Array<{ x: number; y: number }> {
    const data: Array<{ x: number; y: number }> = [];
    const func = this.parseExpression(expression, variable);
    
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

  static generateParametricData(
    xExpression: string, 
    yExpression: string, 
    variable: string, 
    min: number, 
    max: number, 
    step: number
  ): Array<{ x: number; y: number }> {
    const data: Array<{ x: number; y: number }> = [];
    const xFunc = this.parseExpression(xExpression, variable);
    const yFunc = this.parseExpression(yExpression, variable);
    
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
}

// Chart data generators
export class ChartDataGenerator {
  static generateFunctionChart(graph: FunctionGraph) {
    const { expression, variable, domain } = graph;
    const { min = -10, max = 10, step = 0.1 } = domain || {};
    
    const data = MathParser.generateFunctionData(expression, variable, min, max, step);
    
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

  static generateBarChart(graph: BarChart) {
    return {
      type: 'bar',
      data: graph.data,
      config: graph.config,
      metadata: {
        dataPoints: graph.data.length
      }
    };
  }

  static generateLineChart(graph: LineChart) {
    return {
      type: 'line',
      data: graph.data,
      config: graph.config,
      metadata: {
        dataPoints: graph.data.length
      }
    };
  }

  static generateScatterPlot(graph: ScatterPlot) {
    return {
      type: 'scatter',
      data: graph.data,
      config: graph.config,
      metadata: {
        dataPoints: graph.data.length
      }
    };
  }

  static generateHistogram(graph: Histogram) {
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

  static generatePolarGraph(graph: PolarGraph) {
    const { expression, variable, domain } = graph;
    const { min = 0, max = 2 * Math.PI, step = 0.1 } = domain || {};
    
    const data = MathParser.generatePolarData(expression, variable, min, max, step);
    
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

  static generateParametricGraph(graph: ParametricGraph) {
    const { xExpression, yExpression, variable, domain } = graph;
    const { min = 0, max = 10, step = 0.1 } = domain || {};
    
    const data = MathParser.generateParametricData(xExpression, yExpression, variable, min, max, step);
    
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
}

// Step-by-step explanation generator
export class StepByStepGenerator {
  static generateSteps(stepByStep: StepByStep): StepByStep {
    // For now, we'll return the step-by-step data as-is
    // In a real implementation, this would contain logic to generate steps
    // based on the problem type and method
    return stepByStep;
  }

  static generateQuadraticSteps(equation: string): StepByStep {
    // Example implementation for quadratic equations
    const steps: Step[] = [
      {
        stepNumber: 1,
        description: "Identify the quadratic equation in standard form",
        equation: equation,
        tip: "Standard form: ax² + bx + c = 0"
      },
      {
        stepNumber: 2,
        description: "Apply the quadratic formula",
        equation: "x = (-b ± √(b² - 4ac)) / 2a",
        tip: "Use when factoring is not obvious"
      },
      {
        stepNumber: 3,
        description: "Calculate the discriminant",
        equation: "Δ = b² - 4ac",
        tip: "Discriminant determines the number of solutions"
      },
      {
        stepNumber: 4,
        description: "Find the solutions",
        equation: "x = (-b + √Δ) / 2a and x = (-b - √Δ) / 2a",
        tip: "Two solutions if Δ > 0, one if Δ = 0, none if Δ < 0"
      }
    ];

    return {
      type: 'step-by-step',
      problem: equation,
      method: 'quadratic formula',
      steps: steps,
      solution: 'x = [calculated values]'
    };
  }

  static generateFactoringSteps(equation: string): StepByStep {
    const steps: Step[] = [
      {
        stepNumber: 1,
        description: "Identify the quadratic equation",
        equation: equation,
        tip: "Look for the form ax² + bx + c = 0"
      },
      {
        stepNumber: 2,
        description: "Find two numbers that multiply to ac and add to b",
        equation: "Find m and n such that m × n = ac and m + n = b",
        tip: "For x² + 5x + 6, find numbers that multiply to 6 and add to 5"
      },
      {
        stepNumber: 3,
        description: "Rewrite the middle term using these numbers",
        equation: "x² + mx + nx + c = 0",
        tip: "Split the bx term into two terms"
      },
      {
        stepNumber: 4,
        description: "Factor by grouping",
        equation: "x(x + m) + n(x + m) = 0",
        tip: "Group terms and factor out common factors"
      },
      {
        stepNumber: 5,
        description: "Factor out the common binomial",
        equation: "(x + m)(x + n) = 0",
        tip: "This gives us the factored form"
      },
      {
        stepNumber: 6,
        description: "Set each factor equal to zero",
        equation: "x + m = 0 or x + n = 0",
        tip: "Use the zero product property"
      },
      {
        stepNumber: 7,
        description: "Solve for x",
        equation: "x = -m or x = -n",
        tip: "These are the solutions"
      }
    ];

    return {
      type: 'step-by-step',
      problem: equation,
      method: 'factoring',
      steps: steps,
      solution: 'x = [calculated values]'
    };
  }
}

// Main tool handler
export async function handleGraphTool(toolName: string, parameters: any) {
  try {
    let result;
    switch (toolName) {
      case 'create_function_graph':
        result = ChartDataGenerator.generateFunctionChart(parameters as FunctionGraph);
        break;
      
      case 'create_bar_chart':
        result = ChartDataGenerator.generateBarChart(parameters as BarChart);
        break;
      
      case 'create_line_chart':
        result = ChartDataGenerator.generateLineChart(parameters as LineChart);
        break;
      
      case 'create_scatter_plot':
        result = ChartDataGenerator.generateScatterPlot(parameters as ScatterPlot);
        break;
      
      case 'create_histogram':
        result = ChartDataGenerator.generateHistogram(parameters as Histogram);
        break;
      
      case 'create_polar_graph':
        result = ChartDataGenerator.generatePolarGraph(parameters as PolarGraph);
        break;
      
      case 'create_parametric_graph':
        result = ChartDataGenerator.generateParametricGraph(parameters as ParametricGraph);
        break;
      
      case 'analyze_data':
        result = analyzeData(parameters.data, parameters.analysisType);
        break;
      
      case 'create_step_by_step':
        result = StepByStepGenerator.generateSteps(parameters as StepByStep);
        break;
      
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
    
    return result;
  } catch (error) {
    throw new Error(`Error executing ${toolName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Data analysis function
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
