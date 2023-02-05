import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import resolvers from './graphql/resolvers';
import path from 'path';
const schema = path.join(__dirname, 'graphql/schema.graphql');
const PORT = process.env.PORT || 3007;
const typeDefs = readFileSync(schema, { encoding: 'utf-8' });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async function bootstrap() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: +PORT },
  });
  console.log(`🚀  Server ready at: ${url}`);
})();