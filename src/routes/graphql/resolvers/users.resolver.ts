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
}

export default new UsersResolver()
