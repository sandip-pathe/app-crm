import { ApolloServer } from 'apollo-server';
import typeDefs from './schema.js';
import resolvers from './resolver.js';
import db from './models/index.js';  // Sequelize models

const server = new ApolloServer({ typeDefs, resolvers });

db.sequelize.sync().then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
