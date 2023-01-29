import { FastifyInstance } from "fastify";

class MemberTypeResolver {
  public async fetchMemberTypes(fastify: FastifyInstance) {
    return await fastify.db.memberTypes.findMany();
  }

  public async fetchMemberType(fastify: FastifyInstance, id: string) {
    const memberType = await fastify.db.memberTypes.findOne({
      key: "id", equals: id
    })

    if (!memberType) {
      throw fastify.httpErrors.notFound("Member Type is not found");
    }

    return memberType
  }
}

export default new MemberTypeResolver()
