'use client';

import { MathExpression } from '@/components/ui/math-expression';

const mathExamples = [
  { label: 'Simple equation', expression: 'x^2 + 3x + 2' },
  {
    label: 'Quadratic formula',
    expression: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
  },
  { label: 'Integral', expression: '\\int_0^1 x^2 dx = \\frac{1}{3}' },
  { label: 'Summation', expression: '\\sum_{i=1}^n i = \\frac{n(n+1)}{2}' },
  { label: 'Trigonometric', expression: '\\sin^2(x) + \\cos^2(x) = 1' },
  { label: 'Limit', expression: '\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1' },
  {
    label: 'Matrix',
    expression: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
  },
  {
    label: 'Function definition',
    expression:
      'f(x) = \\begin{cases} x^2 & \\text{if } x \\geq 0 \\\\ -x^2 & \\text{if } x < 0 \\end{cases}',
  },
];

export function MathDemo() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="font-bold text-2xl">Math Rendering Demo</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mathExamples.map((example, index) => (
          <div className="space-y-2 rounded-lg border p-4" key={index}>
            <h3 className="font-medium text-gray-600 text-sm">
              {example.label}
            </h3>
            <div className="rounded bg-gray-50 p-3">
              <MathExpression expression={example.expression} inline={false} />
            </div>
            <code className="block text-gray-500 text-xs">
              {example.expression}
            </code>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-3 font-semibold text-lg">Inline Math Examples</h3>
        <div className="space-y-2 text-sm">
          <p>
            The quadratic formula is{' '}
            <MathExpression
              expression="x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
              inline={true}
            />
            and it's used to solve equations of the form{' '}
            <MathExpression expression="ax^2 + bx + c = 0" inline={true} />.
          </p>
          <p>
            The derivative of <MathExpression expression="x^n" inline={true} />{' '}
            is <MathExpression expression="nx^{n-1}" inline={true} />.
          </p>
          <p>
            Euler's identity:{' '}
            <MathExpression expression="e^{i\\pi} + 1 = 0" inline={true} />
          </p>
        </div>
      </div>
    </div>
  );
}
