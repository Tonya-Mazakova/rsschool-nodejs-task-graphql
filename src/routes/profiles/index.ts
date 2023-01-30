import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return this.db.profiles.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | void> {
      const paramsValidationFunction = request.getValidationFunction('params')
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidParams) {
        return reply.badRequest()
      }

      const profile = await this.db.profiles.findOne({
        key: "id", equals: request.params.id
      })

      if (!profile) {
        return reply.notFound()
      }

      return profile
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | void> {
      const bodyValidationFunction = request.getValidationFunction('body')
      const isValidBody = bodyValidationFunction(request.body)

      if (!isValidBody) {
        return reply.badRequest()
      }

      const profile = await this.db.profiles.findOne({
        key: "userId", equals: request.body.userId
      })

      const memeberType = await this.db.memberTypes.findOne({
        key: "id", equals: request.body.memberTypeId
      })

      if (profile || !memeberType) {
        return reply.badRequest()
      }

      return await this.db.profiles.create({
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
    async function (request, reply): Promise<ProfileEntity | void> {
      const paramsValidationFunction = request.getValidationFunction('params')
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidParams) {
        return reply.badRequest()
      }

      const profile =
        await this.db.profiles.findOne({
          key: "id", equals: request.params.id
        })

      if (!profile) {
        return reply.badRequest()
      }

      return await this.db.profiles.delete(request.params.id)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | void> {
      const paramsValidationFunction = request.getValidationFunction('params')
      const bodyValidationFunction = request.getValidationFunction('body')
      const isValidBody = bodyValidationFunction(request.body)
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidBody || !isValidParams) {
        return reply.badRequest()
      }

      const profile =
        await this.db.profiles.findOne({
          key: "id", equals: request.params.id
        })

      if (!profile) {
        return reply.badRequest()
      }

      if (request.body.memberTypeId) {
        const memberType =
          await this.db.memberTypes.findOne({
            key: "id",
            equals: request.body.memberTypeId
          })

        if (!memberType) {
          return reply.badRequest()
        }
      }

      return await this.db.profiles.change(request.params.id, request.body)
    }
  );
};

export default plugin;
