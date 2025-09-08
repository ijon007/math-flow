// Helper functions for step-by-step tags
export const getStepByStepTags = (problem: string, method: string) => {
  const problemLower = problem.toLowerCase();
  const methodLower = method.toLowerCase();
  const tags = ['step-by-step', 'solution', 'mathematics'];

  // Problem-based tags
  if (problemLower.includes('algebra')) tags.push('algebra');
  if (problemLower.includes('calculus')) tags.push('calculus');
  if (problemLower.includes('geometry')) tags.push('geometry');
  if (problemLower.includes('trigonometry')) tags.push('trigonometry');
  if (problemLower.includes('statistics')) tags.push('statistics');
  if (problemLower.includes('probability')) tags.push('probability');
  if (problemLower.includes('linear')) tags.push('linear-algebra');
  if (problemLower.includes('differential'))
    tags.push('differential-equations');
  if (problemLower.includes('integral')) tags.push('integrals');
  if (problemLower.includes('derivative')) tags.push('derivatives');
  if (problemLower.includes('equation')) tags.push('equations');
  if (problemLower.includes('solve')) tags.push('solving');

  // Method-based tags
  if (methodLower.includes('factoring')) tags.push('factoring');
  if (methodLower.includes('quadratic')) tags.push('quadratic-formula');
  if (methodLower.includes('substitution')) tags.push('substitution');
  if (methodLower.includes('elimination')) tags.push('elimination');
  if (methodLower.includes('integration')) tags.push('integration');
  if (methodLower.includes('differentiation')) tags.push('differentiation');
  if (methodLower.includes('chain rule')) tags.push('chain-rule');
  if (methodLower.includes('product rule')) tags.push('product-rule');
  if (methodLower.includes('quotient rule')) tags.push('quotient-rule');

  return tags;
};

// Helper functions for graph metadata
export const getGraphTitle = (toolType: string, input: any) => {
  switch (toolType) {
    case 'create_function_graph':
      return `Function Graph: ${input.expression}`;
    case 'create_bar_chart':
      return 'Bar Chart';
    case 'create_line_chart':
      return 'Line Chart';
    case 'create_scatter_plot':
      return 'Scatter Plot';
    case 'create_histogram':
      return 'Histogram';
    case 'create_polar_graph':
      return `Polar Graph: ${input.expression}`;
    case 'create_parametric_graph':
      return 'Parametric Graph';
    default:
      return 'Graph';
  }
};

export const getGraphDescription = (toolType: string, input: any, output: any) => {
  switch (toolType) {
    case 'create_function_graph':
      return `Graph of ${input.expression}`;
    case 'create_bar_chart':
      return `Bar chart with ${input.data?.length || 0} data points`;
    case 'create_line_chart':
      return `Line chart with ${input.data?.length || 0} data points`;
    case 'create_scatter_plot':
      return `Scatter plot with ${input.data?.length || 0} data points`;
    case 'create_histogram':
      return `Histogram with ${input.bins || 10} bins`;
    case 'create_polar_graph':
      return `Polar graph of ${input.expression}`;
    case 'create_parametric_graph':
      return `Parametric graph: x=${input.xExpression}, y=${input.yExpression}`;
    default:
      return 'Generated graph';
  }
};

export const getGraphType = (toolType: string) => {
  switch (toolType) {
    case 'create_function_graph':
      return 'function';
    case 'create_bar_chart':
      return 'bar';
    case 'create_line_chart':
      return 'line';
    case 'create_scatter_plot':
      return 'scatter';
    case 'create_histogram':
      return 'histogram';
    case 'create_polar_graph':
      return 'polar';
    case 'create_parametric_graph':
      return 'parametric';
    default:
      return 'unknown';
  }
};

export const getGraphEquation = (toolType: string, input: any) => {
  switch (toolType) {
    case 'create_function_graph':
      return input.expression;
    case 'create_polar_graph':
      return input.expression;
    case 'create_parametric_graph':
      return `x=${input.xExpression}, y=${input.yExpression}`;
    default:
      return;
  }
};

export const getGraphTags = (toolType: string) => {
  switch (toolType) {
    case 'create_function_graph':
      return ['function', 'graph', 'mathematics'];
    case 'create_bar_chart':
      return ['bar', 'chart', 'data'];
    case 'create_line_chart':
      return ['line', 'chart', 'trend'];
    case 'create_scatter_plot':
      return ['scatter', 'plot', 'correlation'];
    case 'create_histogram':
      return ['histogram', 'distribution', 'statistics'];
    case 'create_polar_graph':
      return ['polar', 'graph', 'mathematics'];
    case 'create_parametric_graph':
      return ['parametric', 'graph', 'mathematics'];
    default:
      return ['graph'];
  }
};

export const getFlashcardTags = (topic: string) => {
  const topicLower = topic.toLowerCase();
  const tags = ['flashcards', 'study', 'learning'];

  if (topicLower.includes('algebra')) tags.push('algebra');
  if (topicLower.includes('calculus')) tags.push('calculus');
  if (topicLower.includes('geometry')) tags.push('geometry');
  if (topicLower.includes('trigonometry')) tags.push('trigonometry');
  if (topicLower.includes('statistics')) tags.push('statistics');
  if (topicLower.includes('probability')) tags.push('probability');
  if (topicLower.includes('linear')) tags.push('linear-algebra');
  if (topicLower.includes('differential'))
    tags.push('differential-equations');
  if (topicLower.includes('integral')) tags.push('integrals');
  if (topicLower.includes('derivative')) tags.push('derivatives');

  return tags;
};
