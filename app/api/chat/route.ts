import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages, smoothStream } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return new Response('Google API key not configured', { status: 500 });
    }

    const result = streamText({
        model: openai('gpt-4o'),
        messages: [
            ...convertToModelMessages(messages)
        ],
        experimental_transform: smoothStream({
            delayInMs: 20,
            chunking: 'word',
        }),
    });

    return result.toUIMessageStreamResponse();
}