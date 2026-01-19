import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url'; 

// const __filename = fileURLToPath(import.meta.url); 
// const __dirname = path.dirname(__filename); 

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start()
  
  // app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use(
    '/graphql', 
    expressMiddleware(server)
  );  

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startServer();
