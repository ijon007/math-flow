'use server';

import { generateText } from 'ai';

export async function generateThreadTitle(userMessage: string, aiResponse: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: 'google/gemini-2.0-flash',
      prompt: 
        `Generate a concise, descriptive title (max 6 words) for this math conversation:

        User: ${userMessage}
        AI: ${aiResponse}

        Title should capture the main math topic and be useful for navigation (max 3 words). Examples:
        - "Quadratic Equations"
        - "Calculus Derivatives" 
        - "Algebra Problem"
        - "Solving Equations"
        - "Analyzing Statistics"

        Title:`,
    });
    
    return text.trim();
  } catch (error) {
    console.error('Failed to generate thread title:', error);
    const words = userMessage.split(' ').slice(0, 4).join(' ');
    return words || 'Math Discussion';
  }
}
