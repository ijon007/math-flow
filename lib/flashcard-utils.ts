export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'hard':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const generateMathCards = (): Record<string, Array<{ front: string; back: string }>> => ({
  algebra: [
    { front: 'What is the quadratic formula?', back: 'x = (-b ± √(b² - 4ac)) / 2a' },
    { front: 'What is the slope-intercept form?', back: 'y = mx + b' },
    { front: 'What is the distributive property?', back: 'a(b + c) = ab + ac' },
    { front: 'What is the vertex form of a parabola?', back: 'y = a(x - h)² + k' },
    { front: 'What is the standard form of a quadratic?', back: 'ax² + bx + c = 0' },
    { front: 'What is the discriminant?', back: 'b² - 4ac' },
    { front: 'What is the axis of symmetry formula?', back: 'x = -b/(2a)' },
    { front: 'What is the FOIL method?', back: 'First, Outer, Inner, Last for multiplying binomials' }
  ],
  geometry: [
    { front: 'What is the area of a circle?', back: 'A = πr²' },
    { front: 'What is the Pythagorean theorem?', back: 'a² + b² = c²' },
    { front: 'What is the sum of angles in a triangle?', back: '180 degrees' },
    { front: 'What is the circumference of a circle?', back: 'C = 2πr' },
    { front: 'What is the area of a triangle?', back: 'A = (1/2)bh' },
    { front: 'What is the area of a rectangle?', back: 'A = lw' },
    { front: 'What is the volume of a sphere?', back: 'V = (4/3)πr³' },
    { front: 'What is the area of a trapezoid?', back: 'A = (1/2)(b₁ + b₂)h' }
  ],
  calculus: [
    { front: 'What is the derivative of x²?', back: '2x' },
    { front: 'What is the integral of 2x?', back: 'x² + C' },
    { front: 'What is the chain rule?', back: 'd/dx[f(g(x))] = f\'(g(x)) · g\'(x)' },
    { front: 'What is the power rule?', back: 'd/dx[xⁿ] = nxⁿ⁻¹' },
    { front: 'What is the product rule?', back: 'd/dx[f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)' },
    { front: 'What is the quotient rule?', back: 'd/dx[f(x)/g(x)] = [f\'(x)g(x) - f(x)g\'(x)]/g(x)²' },
    { front: 'What is the derivative of sin(x)?', back: 'cos(x)' },
    { front: 'What is the derivative of cos(x)?', back: '-sin(x)' }
  ],
  trigonometry: [
    { front: 'What is sin²θ + cos²θ?', back: '1 (Pythagorean identity)' },
    { front: 'What is the sine of 30°?', back: '1/2' },
    { front: 'What is the cosine of 60°?', back: '1/2' },
    { front: 'What is the tangent of 45°?', back: '1' },
    { front: 'What is the period of sin(x)?', back: '2π' },
    { front: 'What is the amplitude of cos(x)?', back: '1' },
    { front: 'What is the reciprocal of sine?', back: 'cosecant (csc)' },
    { front: 'What is the reciprocal of cosine?', back: 'secant (sec)' }
  ]
});

export const findTopicKey = (topic: string, mathCards: Record<string, Array<{ front: string; back: string }>>) => {
  return Object.keys(mathCards).find(key => 
    topic.toLowerCase().includes(key)
  ) as keyof typeof mathCards;
};
