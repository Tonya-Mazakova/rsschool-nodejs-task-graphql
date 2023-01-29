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
import { userType, profileType, postType, memberType } from './types';
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
        name: 'Query',
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
            resolve: async (_source, id) => await usersResolver.fetchUser(fastify, id)
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
            resolve: async (_source, id) => await profileResolver.fetchProfile(fastify, id),
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
            resolve: async (_source, id) => await postResolver.fetchPost(fastify, id),
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
            resolve: async (_source, id) => await memberTypeResolver.fetchMemberType(fastify, id),
          },
        }),
      });

      // const mutationType = {
      //
      // }

      const schema = new GraphQLSchema({
        query: queryType,
        // mutation: mutationType
      })

      return await graphql({
        schema,
        source: request.body.query as string
      });
    }
  );
};

export default plugin;
