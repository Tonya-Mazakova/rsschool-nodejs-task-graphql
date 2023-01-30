import {GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";
import {memberTypeResolver, postResolver, profileResolver, usersResolver} from "./resolvers";
import {memberType, postType, profileType, userType} from "./types";
import {FastifyInstance} from "fastify";

export const getQueryType = (fastify: FastifyInstance) => {
  return new GraphQLObjectType({
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
}
