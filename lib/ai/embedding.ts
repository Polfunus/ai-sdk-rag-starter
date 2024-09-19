import { embed, embedMany } from "ai"
import { openai } from '@ai-sdk/openai';
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "../db/schema/embeddings";
import { db } from "../db";
import { loadPDF } from "../web-pdf-loader";

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
    // return input
    //     .trim()
    //     .split('.')
    //     .filter(i => i !== '');

    // split the input into chunks of 1000 characters
    const chunks = [];
    let chunk = '';
    for (const sentence of input.split('.')) {
        if (chunk.length + sentence.length < 1000) {
            chunk += sentence + '.';
        } else {
            chunks.push(chunk);
            chunk = sentence + '.';
        }
    }
    chunks.push(chunk);
    return chunks;
};


export const generateEmbeddings = async (
    value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
    const chunks = generateChunks(value);
    const { embeddings } = await embedMany({
        model: embeddingModel,
        values: chunks,
    });
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generatePDFEmbeddings = async (
    url: string,
) => {
    const pdfChunkContents = await loadPDF(url);
    //generate an array of all the text content in the pdf
    const chunks = pdfChunkContents.map(chunk => chunk.pageContent);

    const { embeddings } = await embedMany({
        model: embeddingModel,
        values: chunks,
    });
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};


export const generateEmbedding = async (value: string): Promise<number[]> => {
    const input = value.replaceAll('\\n', ' ');
    const { embedding } = await embed({
        model: embeddingModel,
        value: input,
    });
    return embedding;
};


export const findRelevantContent = async (userQuery: string) => {
    const userQueryEmbedded = await generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(
        embeddings.embedding,
        userQueryEmbedded,
    )})`;
    const similarGuides = await db
        .select({ name: embeddings.content, similarity })
        .from(embeddings)
        .where(gt(similarity, 0.5))
        .orderBy(t => desc(t.similarity))
        .limit(4);
    return similarGuides.map(guide => guide.name);
};