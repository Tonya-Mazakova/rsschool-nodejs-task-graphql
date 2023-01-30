import { FastifyInstance } from "fastify";

class MemberTypeResolver {
  public async fetchMemberTypes(fastify: FastifyInstance) {
    return await fastify.db.memberTypes.findMany();
  }

  public async fetchMemberType(fastify: FastifyInstance, args: { id: string }) {
    const memberType = await fastify.db.memberTypes.findOne({
      key: "id", equals: args?.id
    })

    if (!memberType) {
      throw fastify.httpErrors.notFound("Member Type is not found");
    }

    return memberType
  }

  public async updateMemberType(fastify: FastifyInstance, args: {
    id: string,
    discount: number,
    monthPostsLimit: number
  }) {
    const {id, ...body} = args

    const memberType = await fastify.db.memberTypes.findOne({
      key: "id", equals: id
    })

    if (!memberType) {
      throw fastify.httpErrors.badRequest()
    }

    return await fastify.db.memberTypes.change(id, body)
  }
}

export default new MemberTypeResolver()
