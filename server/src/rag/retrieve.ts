import { embedSingle } from './embed.js';
import { vectorStore, VectorEntry } from './vectorStore.js';

// cosine similarity search
function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

export async function retrieveTopK(
  query: string,
  k = 5
): Promise<VectorEntry[]> {
  const queryEmbedding = await embedSingle(query);

  return vectorStore
    .map(entry => ({
      ...entry,
      score: cosineSimilarity(queryEmbedding, entry.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}