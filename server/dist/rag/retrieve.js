import { embedSingle } from './embed.js';
import { vectorStore } from './vectorStore.js';
// cosine similarity search
function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
}
export async function retrieveTopK(query, k = 5) {
    const queryEmbedding = await embedSingle(query);
    return vectorStore
        .map(entry => ({
        ...entry,
        score: cosineSimilarity(queryEmbedding, entry.embedding),
    }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
}
