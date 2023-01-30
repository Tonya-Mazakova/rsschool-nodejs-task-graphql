import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  graphql
} from "graphql";
import {
  userType,
  profileType,
  postType,
  memberType,
  CreateUserInput,
  CreateProfileInput,
  CreatePostInput,
  UpdateUserInput,
  UpdateProfileInput,
  UpdatePostInput,
  UpdateMemberTypeInput,
  SubscribeToUserInput,
  UnsubscribeFromUserInput
} from './types';
import {
  usersResolver,
  profileResolver,
  postResolver,
  memberTypeResolver
} from './resolvers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const queryType = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: () => ({
          users: {
            type: new GraphQLList(userType),
            description: "Fetch all users",
            resolve: async () => await usersResolver.fetchUsers(fastify),
          },
          profiles: {
            type: new GraphQLList(profileType),
            description: "Fetch all profiles",
            resolve: async () => await profileResolver.fetchProfiles(fastify),
          },
          posts: {
            type: new GraphQLList(postType),
            description: "Fetch all posts",
            resolve: async () => await postResolver.fetchPosts(fastify),
          },
          memberTypes: {
            type: new GraphQLList(memberType),
            description: "Fetch all member types",
            resolve: async () => await memberTypeResolver.fetchMemberTypes(fastify),
          },
          user: {
            type: userType,
            description: "Fetch User by ID",
            args: {
              id: {
                description: "User ID",
                type: new GraphQLNonNull(GraphQLString),
              },
            },
            resolve: async (_source, args) => await usersResolver.fetchUser(fastify, args)
          },
          profile: {
            type: profileType,
            description: "Fetch Profile by ID",
            args: {
              id: {
                description: "Profile ID must be a string",
                type: new GraphQLNonNull(GraphQLString),
              },
            },
            resolve: async (_source, args) => await profileResolver.fetchProfile(fastify, args),
          },
          post: {
            type: postType,
            description: "Fetch Post by ID",
            args: {
              id: {
                description: "Post ID must be a string",
                type: new GraphQLNonNull(GraphQLString),
              },
            },
            resolve: async (_source, args) => await postResolver.fetchPost(fastify, args),
          },
          memberType: {
            type: memberType,
            description: "Fetch Member Type by ID",
            args: {
              id: {
                description: "Member Type ID must be a string",
                type: new GraphQLNonNull(GraphQLString),
              },
            },
            resolve: async (_source, args) => await memberTypeResolver.fetchMemberType(fastify, args),
          },
        }),
      });

      const mutationType = new GraphQLObjectType({
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

      const schema = new GraphQLSchema({
        query: queryType,
        mutation: mutationType
      })

      return await graphql({
        schema,
        source: request.body.query as string,
        variableValues: request.body.variables,
        contextValue: fastify
      });
    }
  );
};

export default plugin;
