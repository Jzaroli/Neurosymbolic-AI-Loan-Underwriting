import OpenAI from 'openai';

// batch embedding 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });

  return response.data.map(d => d.embedding);
}

export async function embedSingle(text: string): Promise<number[]> {
  const embeddings = await embedBatch([text]);
  return embeddings[0];
}