import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { ApolloServer } from "@apollo/server";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
const app = express();

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDef from "./typeDefs/index.js";
import { connectDb } from "./db/connectDb.js";
import { buildContext } from "graphql-passport";
import { configurePassport } from "./passport/passport.config.js";
dotenv.config();
configurePassport();
const httpServer = http.createServer(app);

const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});
store.on("error", err => console.log(err));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
    store: store,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDef,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
await connectDb();
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
