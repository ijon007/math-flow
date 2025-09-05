'use client';

import { MathExpression } from '@/components/ui/math-expression';

const mathExamples = [
  { label: 'Simple equation', expression: 'x^2 + 3x + 2' },
  { label: 'Quadratic formula', expression: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
  { label: 'Integral', expression: '\\int_0^1 x^2 dx = \\frac{1}{3}' },
  { label: 'Summation', expression: '\\sum_{i=1}^n i = \\frac{n(n+1)}{2}' },
  { label: 'Trigonometric', expression: '\\sin^2(x) + \\cos^2(x) = 1' },
  { label: 'Limit', expression: '\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1' },
  { label: 'Matrix', expression: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: 'Function definition', expression: 'f(x) = \\begin{cases} x^2 & \\text{if } x \\geq 0 \\\\ -x^2 & \\text{if } x < 0 \\end{cases}' },
];

export function MathDemo() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Math Rendering Demo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mathExamples.map((example, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-sm text-gray-600">{example.label}</h3>
            <div className="bg-gray-50 p-3 rounded">
              <MathExpression 
                expression={example.expression}
                inline={false}
              />
            </div>
            <code className="text-xs text-gray-500 block">
              {example.expression}
            </code>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">Inline Math Examples</h3>
        <div className="space-y-2 text-sm">
          <p>
            The quadratic formula is <MathExpression expression="x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" inline={true} /> 
            and it's used to solve equations of the form <MathExpression expression="ax^2 + bx + c = 0" inline={true} />.
          </p>
          <p>
            The derivative of <MathExpression expression="x^n" inline={true} /> is <MathExpression expression="nx^{n-1}" inline={true} />.
          </p>
          <p>
            Euler's identity: <MathExpression expression="e^{i\\pi} + 1 = 0" inline={true} />
          </p>
        </div>
      </div>
    </div>
  );
}
