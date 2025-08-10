require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');

// Import GraphQL schema and resolvers
const typeDefs = require('./schema/typeDefs');
const courseResolvers = require('./resolvers/courseResolvers');
const userResolvers = require('./resolvers/userResolvers');
const enrollmentResolvers = require('./resolvers/enrollmentResolvers');
const { getUser } = require('./middleware/auth');

// Merge all resolvers
const resolvers = {
  Query: {
    ...courseResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...courseResolvers.Mutation,
    ...userResolvers.Mutation,
    ...enrollmentResolvers.Mutation,
  },
  Course: courseResolvers.Course,
  User: userResolvers.User,
  Enrollment: enrollmentResolvers.Enrollment,
};

async function startServer() {
  const app = express();

  // Enable CORS
  app.use(cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://educourse-5dx4.onrender.com',
      'https://educourse-backend.onrender.com',
      'https://educourse-backend.onrender.com/graphql',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Get user from token for every request
      const user = await getUser(req);
      return { user };
    },
    // Enable GraphQL Playground in development
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`📊 GraphQL Playground available in development mode`);
  });
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer().catch((error) => {
  console.error('Error starting server:', error);
});