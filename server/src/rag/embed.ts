import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Embeds an array of strings safely.
// Filters out empty or invalid entries to avoid 400 errors.

export async function embedBatch(texts: string[]): Promise<number[][]> {
  // Remove invalid or empty strings
  if (texts.length === 0) {
    throw new Error('No valid text to embed.');
  }

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });

  return response.data.map(d => d.embedding);
}

// Embeds a single string safely.
export async function embedSingle(text: string): Promise<number[]> {
  if (typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Cannot embed empty or invalid text.');
  }

  const embeddings = await embedBatch([text]);
  return embeddings[0];
}