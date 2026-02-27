import { encoding_for_model } from 'tiktoken';
const enc = encoding_for_model('gpt-4o-mini');
const textDecoder = new TextDecoder();
export function chunkText(text, chunkSize = 450, overlap = 100) {
    const tokens = enc.encode(text);
    const chunks = [];
    for (let i = 0; i < tokens.length; i += chunkSize - overlap) {
        const slice = tokens.subarray(i, i + chunkSize);
        const decodedBytes = enc.decode(slice);
        const decodedText = textDecoder.decode(decodedBytes);
        chunks.push(decodedText);
    }
    return chunks;
}
