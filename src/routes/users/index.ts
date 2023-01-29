import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await this.db.users.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void> {
      const paramsValidationFunction = request.getValidationFunction('params')
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidParams) {
        return reply.badRequest()
      }

      const result =
        await this.db.users.findOne({
          key: "id", equals: request.params.id
        })

      if (!result) {
        return reply.notFound()
      }

      return result
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void> {
      const bodyValidationFunction = request.getValidationFunction('body')
      const isValidBody = bodyValidationFunction(request.body)

      if (!isValidBody) {
        return reply.badRequest()
      }

      return await this.db.users.create({
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
    async function (request, reply): Promise<UserEntity | void> {
      const paramsValidationFunction = request.getValidationFunction('params')
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidParams) {
        return reply.badRequest()
      }

      const user =
        await this.db.users.findOne({
          key: "id", equals: request.params.id
        })

      if (!user) {
        return reply.notFound()
      }

      const userProfile =
        await this.db.profiles.findOne({ key: 'userId', equals: request.params.id })

      if (userProfile) {
        await this.db.profiles.delete(userProfile.id);
      }

      const userPosts =
        await this.db.posts.findMany({ key: 'userId', equals: request.params.id })

      await Promise.all(
        userPosts?.map(async (post) => {
          await this.db.posts.delete(post.id);
        }),
      )

      const subscribedToUserArr =
        await this.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: request.params.id
        });

      await Promise.all(
        subscribedToUserArr.map(async (subscribedToUser) => {
          const subscribedToUserIds =
            subscribedToUser.subscribedToUserIds
              .filter((userID) => userID !== request.params.id)

          await this.db.users.change(subscribedToUser.id, { subscribedToUserIds });
        }),
      );

      return await this.db.users.delete(request.params.id)
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void>{
      const paramsValidationFunction = request.getValidationFunction('params')
      const bodyValidationFunction = request.getValidationFunction('body')
      const isValidBody = bodyValidationFunction(request.body)
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidBody || !isValidParams) {
        return reply.badRequest()
      }

      const user = await this.db.users
        .findOne({ key: "id", equals: request.params.id })

      const subscribedToUser = await this.db.users
        .findOne({ key: "id", equals: request.body.userId })

      if (!user || !subscribedToUser) {
        return reply.notFound()
      }

      user.subscribedToUserIds.push(request.body.userId)

      return await this.db.users.change(request.params.id, user)
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void> {
      const paramsValidationFunction = request.getValidationFunction('params')
      const bodyValidationFunction = request.getValidationFunction('body')
      const isValidBody = bodyValidationFunction(request.body)
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidBody || !isValidParams) {
        return reply.badRequest()
      }

      const user = await this.db.users
        .findOne({ key: "id", equals: request.params.id })

      const unSubscribedToUser = await this.db.users
        .findOne({ key: "id", equals: request.body.userId })

      if (!user || !unSubscribedToUser) {
        return reply.notFound()
      }

      const isSubscribed =
        user.subscribedToUserIds.some((userID) => userID === request.body.userId )

      if (!isSubscribed) {
        return reply.badRequest()
      }

      const subscribedToUserIds =
        user.subscribedToUserIds.filter((userID) => userID !== request.body.userId)

      user.subscribedToUserIds = [...subscribedToUserIds]

      return await this.db.users.change(request.params.id, user)
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | void> {
      const paramsValidationFunction = request.getValidationFunction('params')
      const bodyValidationFunction = request.getValidationFunction('body')
      const isValidBody = bodyValidationFunction(request.body)
      const isValidParams = paramsValidationFunction(request.params)

      if (!isValidBody || !isValidParams) {
        return reply.badRequest()
      }

      const user = await this.db.users
        .findOne({ key: "id", equals: request.params.id })

      if (!user) {
         return reply.notFound()
      }

      return await this.db.users.change(request.params.id, {...request.body})
    }
  );
};

export default plugin;
