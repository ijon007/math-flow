export interface Graph {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
  equation: string;
  tags: string[];
  thumbnail: string;
  data?: any[]; // Graph data points from database
  config?: any; // Graph configuration from database
  metadata?: any; // Additional metadata from database
}

export const generatedGraphs: Graph[] = [
  {
    id: '1',
    title: 'Quadratic Function Analysis',
    description:
      'Graph of f(x) = x² - 4x + 3 with vertex, roots, and axis of symmetry',
    type: 'Function Graph',
    createdAt: '2024-01-15',
    equation: 'f(x) = x² - 4x + 3',
    tags: ['Quadratic', 'Functions', 'Algebra'],
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: '2',
    title: 'Trigonometric Wave Comparison',
    description:
      'Comparison of sin(x), cos(x), and tan(x) functions over [-2π, 2π]',
    type: 'Trigonometric',
    createdAt: '2024-01-14',
    equation: 'sin(x), cos(x), tan(x)',
    tags: ['Trigonometry', 'Waves', 'Functions'],
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: '3',
    title: 'Exponential Growth Model',
    description:
      'Population growth model using exponential function with different growth rates',
    type: 'Exponential',
    createdAt: '2024-01-13',
    equation: 'P(t) = P₀ × e^(rt)',
    tags: ['Exponential', 'Growth', 'Modeling'],
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: '4',
    title: 'Derivative Visualization',
    description:
      'Function and its derivative showing critical points and inflection points',
    type: 'Calculus',
    createdAt: '2024-01-12',
    equation: 'f(x) = x³ - 3x² + 2x',
    tags: ['Calculus', 'Derivatives', 'Critical Points'],
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: '5',
    title: '3D Surface Plot',
    description: 'Three-dimensional surface plot of z = sin(x)cos(y)',
    type: '3D Plot',
    createdAt: '2024-01-11',
    equation: 'z = sin(x)cos(y)',
    tags: ['3D', 'Surface', 'Multivariable'],
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: '6',
    title: 'Statistical Distribution',
    description:
      'Normal distribution curve with mean and standard deviation visualization',
    type: 'Statistics',
    createdAt: '2024-01-10',
    equation: 'N(μ, σ²)',
    tags: ['Statistics', 'Normal Distribution', 'Probability'],
    thumbnail: '/api/placeholder/300/200',
  },
];
