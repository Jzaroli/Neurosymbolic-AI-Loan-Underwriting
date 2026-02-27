import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { loadPDFs } from './rag/loadDocs.js';
import { chunkText } from './rag/chunk.js';
import { embedBatch } from './rag/embed.js';
import { vectorStore } from './rag/vectorStore.js';
dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const startServer = async () => {
    await server.start();
    app.use(express.json());
    // attach Apollo GraphQL middleware
    app.use('/graphql', expressMiddleware(server));
    // build RAG vector store on boot
    console.log('Loading PDFs...');
    const docs = await loadPDFs();
    const allChunks = [];
    for (const doc of docs) {
        allChunks.push(...chunkText(doc));
    }
    console.log('Embedding chunks...');
    const embeddings = await embedBatch(allChunks);
    embeddings.forEach((embedding, i) => {
        vectorStore.push({
            embedding,
            content: allChunks[i],
        });
    });
    console.log('Vector store ready:', vectorStore.length);
    // start express server
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
startServer();
