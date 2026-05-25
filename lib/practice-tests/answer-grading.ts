export interface GradableQuestion {
  correctAnswer: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'short-answer';
  options?: string[];
}

function normalizeAnswer(answer: string): string {
  return answer.toLowerCase().trim().replace(/\s+/g, ' ');
}

function matchesOptionText(userAnswer: string, optionText: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(optionText);
}

export function isAnswerCorrect(
  userAnswer: string,
  question: GradableQuestion
): boolean {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(question.correctAnswer);

  if (!normalizedUser) {
    return false;
  }

  if (normalizedUser === normalizedCorrect) {
    return true;
  }

  if (question.type === 'multiple-choice' && question.options?.length) {
    const correctOption = question.options.find((option) =>
      matchesOptionText(option, question.correctAnswer)
    );

    if (correctOption && matchesOptionText(userAnswer, correctOption)) {
      return true;
    }

    const letterOnly = question.correctAnswer.trim().match(/^([A-Da-d])[.)]?$/);
    if (letterOnly) {
      const optionIndex = letterOnly[1].toUpperCase().charCodeAt(0) - 65;
      const optionText = question.options[optionIndex];
      if (optionText && matchesOptionText(userAnswer, optionText)) {
        return true;
      }
    }

    const prefixedLetter = question.correctAnswer.trim().match(/^([A-Da-d])[.)]\s*(.+)$/);
    if (prefixedLetter) {
      const optionIndex = prefixedLetter[1].toUpperCase().charCodeAt(0) - 65;
      const optionText = question.options[optionIndex] ?? prefixedLetter[2];
      if (matchesOptionText(userAnswer, optionText)) {
        return true;
      }
    }
  }

  return false;
}
