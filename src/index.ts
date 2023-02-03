import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
const PORT = process.env.PORT || 3007;


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