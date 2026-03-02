import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { loadPDFs } from './rag/loadDocs.js';
import { chunkText } from './rag/chunk.js';
import { embedBatch } from './rag/embed.js';
import { vectorStore } from './rag/vectorStore.js';
import rateLimit from 'express-rate-limit';
dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();
const limiter = rateLimit({
    windowMs: 60 * 60000, // 60 minute window
    max: 6, // 6 requests per hour per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Rate limit exceeded: 6 per hour, max",
        message: "Too many requests. Please wait before submitting another profile.",
    },
});
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const startServer = async () => {
    await server.start();
    app.use(express.json());
    // attach Apollo GraphQL middleware and limiter
    app.use('/graphql', limiter, expressMiddleware(server));
    // trust proxy for Render deployment
    app.set('trust proxy', 1);
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
    // serve static files
    app.use(express.static(path.join(process.cwd(), '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(process.cwd(), '../client/dist', 'index.html'));
    });
    // start express server
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};
startServer();
