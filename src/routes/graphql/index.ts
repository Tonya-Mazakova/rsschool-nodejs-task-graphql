import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
  GraphQLSchema,
  graphql
} from "graphql";
import { getQueryType } from "./queryType";
import { getMutationType } from "./mutationType";
import { profileResolver, postResolver, memberTypeResolver, usersResolver } from "./resolvers";

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
      const profileDataLoader = await profileResolver.getProfileDataLoader(fastify);
      const postDataLoader = await postResolver.getPostDataLoader(fastify);
      const memberTypeDataLoader = await memberTypeResolver.getMemberTypeDataLoader(fastify);
      const userSubscribedToDataLoader = await usersResolver.getUserSubscribedToDataLoader(fastify);
      const subscribedToUserDataLoader = await usersResolver.getSubscribedToUserDataLoader(fastify);

      const schema = new GraphQLSchema({
        query: getQueryType(fastify),
        mutation: getMutationType(fastify)
      })

      return await graphql({
        schema,
        source: request.body.query as string,
        variableValues: request.body.variables,
        contextValue: {
          fastify,
          profileDataLoader,
          postDataLoader,
          memberTypeDataLoader,
          userSubscribedToDataLoader,
          subscribedToUserDataLoader
        }
      });
    }
  );
};

export default plugin;
