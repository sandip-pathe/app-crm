import User from "./models/user.js";

const resolvers = {
  Query: {
    users: async () => {
      return await User.findAll();
    },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      return await User.create({ name, email });
    },
  },
};

export default resolvers;
