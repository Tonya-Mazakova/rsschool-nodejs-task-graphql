import { FastifyInstance } from "fastify";

class UsersResolver {
  public async fetchUsers(fastify: FastifyInstance) {
    return await fastify.db.users.findMany()
  }

 public async fetchUser(fastify: FastifyInstance, args: { id: string }) {
   const user =
     await fastify.db.users.findOne({
       key: "id", equals: args?.id
     })

   if (!user) {
     throw fastify.httpErrors.notFound("User is not found");
   }

   return user
 }

  public async createUser(fastify: FastifyInstance, args: {
    firstName: string,
    lastName: string,
    email: string
  }) {
    return await fastify.db.users.create(args)
  }

  public async updateUser(fastify: FastifyInstance, args: {
    id: string,
    firstName: string,
    lastName: string,
    email: string
  }) {
    const {id, ...body} = args
    const user = await fastify.db.users.findOne({ key: 'id', equals: id });

    if (!user) {
      throw fastify.httpErrors.notFound('User is not found');
    }

    return fastify.db.users.change(id, body);
  }

  public async subscribeToUser(fastify: FastifyInstance, args: {
    userId: string,
    subscribeToUserId: string
  }) {
    const {userId, subscribeToUserId} = args

    const user = await fastify.db.users
      .findOne({ key: "id", equals: userId })

    const subscribeToUser = await fastify.db.users
      .findOne({ key: "id", equals: subscribeToUserId })

    if (!user || !subscribeToUser) {
      throw fastify.httpErrors.notFound();
    }

    const isAlreadySubscribed =
      user.subscribedToUserIds.includes(subscribeToUserId);

    if (isAlreadySubscribed || userId === subscribeToUserId) {
      throw fastify.httpErrors.badRequest();
    }

    user.subscribedToUserIds.push(subscribeToUserId)
    const subscribedToUserIds = [...user.subscribedToUserIds]

    return await fastify.db.users.change(
      userId,
      { subscribedToUserIds }
    )
  }

  public async unsubscribeFromUser(fastify: FastifyInstance, args: {
    userId: string,
    unsubscribeFromUserId: string
  }) {
    const { userId, unsubscribeFromUserId } = args

    const user = await fastify.db.users
      .findOne({ key: "id", equals: userId })

    const unSubscribeToUser = await fastify.db.users
      .findOne({ key: "id", equals: unsubscribeFromUserId })

    if (!user || !unSubscribeToUser) {
      throw fastify.httpErrors.notFound();
    }

    const isSubscribed =
      user.subscribedToUserIds.includes(unsubscribeFromUserId)

    if (!isSubscribed || userId === unsubscribeFromUserId) {
      throw fastify.httpErrors.badRequest();
    }

    const subscribedToUserIds =
      [...user.subscribedToUserIds].filter((userID) => userID !== unsubscribeFromUserId)

    return await fastify.db.users.change(
      userId,
      { subscribedToUserIds }
    )
  }
}

export default new UsersResolver()
