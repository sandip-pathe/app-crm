const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");

// MongoDB Atlas connection URI
const mongoURI =
  "mongodb+srv://sandipp:snake@cluster0.mmqkj.mongodb.net/?retryWrites=true&w=majority&appName=cluster0";

// Connect to MongoDB (no deprecated options needed)
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log(err));

// Define Mongoose schema and model for User
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// Define GraphQL schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    users: async () => await User.find(),
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const user = new User({ name, email });
      await user.save();
      return user;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    // Add logic here to verify the token if needed
    return { token };
  },
});

// Start the server
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}graphql`);
});
