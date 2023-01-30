import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return this.db.posts.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | void> {
      const paramsValidationFunction = request.getValidationFunction('params')
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidParams) {
        return reply.badRequest()
      }

      const post = await this.db.posts.findOne({
        key: "id", equals: request.params.id
      })

      if (!post) {
        return reply.notFound()
      }

      return post
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      return await this.db.posts.create({
        ...request.body
      })
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | void> {
      const paramsValidationFunction = request.getValidationFunction('params')
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidParams) {
        return reply.badRequest()
      }

      const post =
        await this.db.posts.findOne({
          key: "id", equals: request.params.id
        })

      if (!post) {
        return reply.badRequest()
      }

      return await this.db.posts.delete(request.params.id)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | void> {
      const paramsValidationFunction = request.getValidationFunction('params')
      const bodyValidationFunction = request.getValidationFunction('body')
      const isValidBody = bodyValidationFunction(request.body)
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidBody || !isValidParams) {
        return reply.badRequest()
      }

      const post =
        await this.db.posts.findOne({
          key: "id", equals: request.params.id
        })

      if (!post) {
        return reply.badRequest()
      }

      return await this.db.posts.change(request.params.id, request.body)
    }
  );
};

export default plugin;
