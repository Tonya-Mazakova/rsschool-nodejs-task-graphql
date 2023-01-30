import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
  GraphQLSchema,
  graphql
} from "graphql";
import { getQueryType } from "./queryType";
import { getMutationType } from "./mutationType";

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
      const schema = new GraphQLSchema({
        query: getQueryType(fastify),
        mutation: getMutationType(fastify)
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
