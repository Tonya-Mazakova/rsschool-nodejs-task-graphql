import { FastifyInstance } from "fastify";

class UsersResolver {
  public async fetchUsers(fastify: FastifyInstance) {
    return await fastify.db.users.findMany()
  }

 public async fetchUser(fastify: FastifyInstance, id: string) {
   const user =
     await fastify.db.users.findOne({
       key: "id", equals: id
     })

   if (!user) {
     throw fastify.httpErrors.notFound("User is not found");
   }

   return user
 }
}

export default new UsersResolver()
