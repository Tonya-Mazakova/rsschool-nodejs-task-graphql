import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType
} from "graphql";
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { profileType, postType, memberType } from "./";

const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    profile: {
      type: profileType,
      resolve: async (user: UserEntity, args: [], context) => context.profileDataLoader.load(user.id),
    },
    posts: {
      type: postType,
      resolve: async (user: UserEntity, args: [], context) => context.postDataLoader.load(user.id),
    },
    memberType: {
      type: memberType,
      resolve: async (user: UserEntity, args: [], context) => {
        const profile = await context.profileDataLoader.load(user.id);

        if (!profile) {
          return
        }

        return context.memberTypeDataLoader.load(profile.memberTypeId);
      },
    },
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
