import { retrieveTopK } from '../rag/retrieve.js';
export default async function askRag(ragMessage) {
    if (!ragMessage) {
        throw new Error('Rag prompt required');
    }
    // Retrieve top chunks
    const topChunks = await retrieveTopK(ragMessage, 4);
    const context = topChunks.map(c => c.content).join("\n\n");
    // Call OpenAI LLM
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: "Summarize the Prompt using the provided Context using <= 120 words. If unsure, say you don't know. If the Context doesn't support the Prompt, focus on summarizing the Prompt and provide a recap of the important metrics related to their risk score, including why they were rated with this risk level. Summarize it once. Don't add special characters. If the candidate is medium or high risk, offer guidance on how to handle their application.",
            },
            {
                role: 'user',
                content: `Context:\n${context}\n\nPrompt:\n${ragMessage}`,
            },
        ],
    });
    if (!completion.choices?.[0].message.content) {
        throw new Error('No content returned from rag pipeline');
    }
    return completion.choices[0].message.content ?? '';
}
