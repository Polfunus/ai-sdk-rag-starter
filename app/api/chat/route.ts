import { createResource } from "@/lib/actions/resources";
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText, tool } from 'ai';
import { z } from "zod";
import { findRelevantContent } from '@/lib/ai/embedding';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();


    const result = await streamText({
        model: openai('gpt-4o'),
        system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
        messages: convertToCoreMessages(messages),
        tools: {
            addResource: tool({
                description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
                parameters: z.object({
                    content: z
                        .string()
                        .describe('the content or resource to add to the knowledge base'),
                }),
                execute: async ({ content }) => createResource({ content }),
            }),
            getInformation: tool({
                description: `get information from your knowledge base to answer questions. if you don't have the information, respond, "Sorry, I don't know."`,
                parameters: z.object({
                    question: z.string().describe('the users question'),
                }),
                execute: async ({ question }) => findRelevantContent(question),
            }),
            showQKKModel: tool({
                description: `Wenn der Benutzer nach dem QKK Modell fragt: Erkläre die 7 Schritte des QKK-Modells: 
                    1. Sich auf den Kunden vorbereiten: Je klarer ich bin, desto sicherer wirke ich, desto mehr vertraut mir mein Kunde.
                    2. Beim Kunden ankommen: 
                    Ein Vertriebler ist ein guter Zuhörer, nicht Redner - er hört aktiv zu und nimmt sein Gegenüber wahr. Sei authentisch!
                    3. Die wahren Bedürfnisse des Kunden abklären: Stellt die richtigen Fragen und hört zu.
                    4. Dem Kunden den Mehrwert unserer Leistung übersetzen: Versetzt sich in die Lage des Kunden.
                    5. Widerstände bearbeiten: Widerstand ist gut, es zeigt Interesse!
                    6. Den Kunden zu einer Entscheidung führen: Beendet jedes Gespräch mit einer Vereinbarung.
                    7. Gemeinsame Reflexion und den Mehrwert sicherstellen: Gegenseitiges Feedback verbindet.
                `,
                parameters: z.object({
                    answer: z.string().describe('Beschreibung des QKK Modells'),
                }),
            })
        },
        onFinish: ({ usage }) => {
            const { promptTokens, completionTokens, totalTokens } = usage;
            // your own logic, e.g. for saving the chat history or recording usage
            console.log('Prompt tokens:', promptTokens);
            console.log('Completion tokens:', completionTokens);
            console.log('Total tokens:', totalTokens);
        },
    });

    return result.toDataStreamResponse();
} 