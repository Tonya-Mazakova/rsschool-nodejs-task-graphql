import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType
} from "graphql";

const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
  }),
})

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString), description: "First name" },
    lastName: { type: new GraphQLNonNull(GraphQLString), description: "Last name" },
    email: { type: new GraphQLNonNull(GraphQLString), description: "User email" },
  },
});

const UpdateUserInput = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString), description: "User ID" },
    firstName: { type: new GraphQLNonNull(GraphQLString), description: "First name" },
    lastName: { type: new GraphQLNonNull(GraphQLString), description: "Last name" },
    email: { type: new GraphQLNonNull(GraphQLString), description: "User email" },
  },
});

const SubscribeToUserInput = new GraphQLInputObjectType({
  name: 'SubscribeToUserInput',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    subscribeToUserId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const UnsubscribeFromUserInput = new GraphQLInputObjectType({
  name: 'UnsubscribeFromUserInput',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    unsubscribeFromUserId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export { CreateUserInput, userType, UpdateUserInput, SubscribeToUserInput, UnsubscribeFromUserInput };
