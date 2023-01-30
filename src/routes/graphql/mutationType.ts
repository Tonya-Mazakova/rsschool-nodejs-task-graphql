import {GraphQLNonNull, GraphQLObjectType} from "graphql";
import {
  CreatePostInput,
  CreateProfileInput,
  CreateUserInput,
  memberType,
  postType,
  profileType,
  UpdateMemberTypeInput,
  UpdatePostInput,
  UpdateUserInput,
  userType,
  SubscribeToUserInput,
  UnsubscribeFromUserInput,
  UpdateProfileInput
} from "./types";
import {memberTypeResolver, postResolver, profileResolver, usersResolver} from "./resolvers";
import {FastifyInstance} from "fastify";

export const getMutationType = (fastify: FastifyInstance) => {
  return new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      createUser: {
        type: userType,
        description: "Create a new user",
        args: { user: { type: new GraphQLNonNull(CreateUserInput) }},
        resolve: async (_, args) => await usersResolver.createUser(fastify, args.user),
      },
      createProfile: {
        type: profileType,
        description: "Create a new profile",
        args: { profile: { type: new GraphQLNonNull(CreateProfileInput) }},
        resolve: async (_, args) => await profileResolver.createProfile(fastify, args.profile),
      },
      createPost: {
        type: postType,
        description: "Create a new post",
        args: { post: { type: new GraphQLNonNull(CreatePostInput) }},
        resolve: async (_, args) => await postResolver.createPost(fastify, args.post),
      },
      updateUser: {
        type: userType,
        description: "Update the existing user",
        args: { user: { type: new GraphQLNonNull(UpdateUserInput) }},
        resolve: async (_, args) => await usersResolver.updateUser(fastify, args.user),
      },
      updateProfile: {
        type: profileType,
        description: "Update user profile",
        args: { profile: { type: new GraphQLNonNull(UpdateProfileInput) } },
        resolve: async (_, args) => await profileResolver.updateProfile(fastify, args.profile),
      },
      updatePost: {
        type: postType,
        description: "Update user post",
        args: { post: { type: new GraphQLNonNull(UpdatePostInput) }},
        resolve: async (_, args) => await postResolver.updatePost(fastify, args.post),
      },
      updateMemberType: {
        type: memberType,
        description: "Update member type",
        args: { memberType: { type: new GraphQLNonNull(UpdateMemberTypeInput)}},
        resolve: async (_, args) => await memberTypeResolver.updateMemberType(fastify, args.memberType),
      },
      subscribeToUser: {
        type: userType,
        description: "Subscribe to User",
        args: { user: { type: new GraphQLNonNull(SubscribeToUserInput)}},
        resolve: async (_, args) => await usersResolver.subscribeToUser(fastify, args.user),
      },
      unsubscribeFromUser: {
        type: userType,
        description: "Unsubscribe from User",
        args: { user: { type: new GraphQLNonNull(UnsubscribeFromUserInput)}},
        resolve: async (_, args) => await usersResolver.unsubscribeFromUser(fastify, args.user),
      },
    },
  })
}
