import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServer } from "@apollo/server";
import dotenv from "dotenv";
const app = express();

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDef from "./typeDefs/index.js";
import { connectDb } from "./db/connectDb.js";
dotenv.config();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs: mergedTypeDef,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  "/",
  cors(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => req,
  })
);

await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
await connectDb();
console.log(`🚀 Server ready at http://localhost:4000/`);
