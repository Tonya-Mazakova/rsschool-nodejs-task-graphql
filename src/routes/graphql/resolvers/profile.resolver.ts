import { FastifyInstance } from "fastify";

class ProfileResolver {
  public async fetchProfiles(fastify: FastifyInstance) {
    return await fastify.db.profiles.findMany();
  }

  public async fetchProfile(fastify: FastifyInstance, args: { id: string }) {
    const profile = await fastify.db.profiles.findOne({
      key: "id", equals: args?.id
    })

    if (!profile) {
      throw fastify.httpErrors.notFound("Profile is not found");
    }

    return profile
  }

  public async createProfile(fastify: FastifyInstance, args: {
    avatar: string,
    sex: string,
    birthday: number,
    country: string,
    street: string,
    city: string,
    userId: string,
    memberTypeId: string
  }) {
   return await fastify.db.profiles.create(args)
  }

  public async updateProfile(fastify: FastifyInstance, args: {
    id: string,
    avatar: string,
    sex: string,
    birthday: number,
    country: string,
    street: string,
    city: string,
    memberTypeId: string
  }) {
    const {id, ...body} = args

    const profile =
      await fastify.db.profiles.findOne({ key: 'id', equals: id });

    if (!profile) {
      throw fastify.httpErrors.badRequest()
    }

    if (args?.memberTypeId) {
      const memberType =
        await fastify.db.memberTypes.findOne({
          key: "id",
          equals: args.memberTypeId
        })

      if (!memberType) {
        throw fastify.httpErrors.badRequest()
      }
    }

    return fastify.db.profiles.change(id, body);
  }
}

export default new ProfileResolver()

