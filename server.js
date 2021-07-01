const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const dotEnv = require("dotenv");
const Dataloader = require("dataloader");
const {
  createRateLimitDirective,
  createRateLimitTypeDef,
} = require('graphql-rate-limit-directive');
const { gql } = require('apollo-server-express');

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const { connection } = require("./database/util");
const { verifyUser } = require("./helper/context");
const loaders = require("./loaders");

// set env variables
dotEnv.config();

const app = express();

//db connectivity
connection();


//cors
app.use(cors());

// body parser middleware
app.use(express.json());

const apolloServer = new ApolloServer({
  typeDefs: [createRateLimitTypeDef(), ...typeDefs],
  resolvers,
  context: async ({ req, connection }) => {
    const contextObj = {};
    if (req) {
      await verifyUser(req);
      contextObj.email = req.email;
      contextObj.loggedInUserId = req.loggedInUserId;
    }
    contextObj.loaders = {
      user: new Dataloader((keys) => loaders.user.batchUsers(keys)),
      currency: new Dataloader((keys) =>
        loaders.currency.batchCurrencies(keys)
      ),
    };
    return contextObj;
  },
  formatError: (error) => {
    return {
      message: error.message,
    };
  },
  schemaDirectives: {
    rateLimit: createRateLimitDirective(),
  },
});

apolloServer.applyMiddleware({ app, path: "/anyfinExchangeRadar" });

const PORT = process.env.PORT || 3000;

app.use("/", (req, res, next) => {
  res.send({ message: "Hello" });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});

apolloServer.installSubscriptionHandlers(httpServer);
