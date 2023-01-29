import { FastifyInstance } from "fastify";

class ProfileResolver {
  public async fetchProfiles(fastify: FastifyInstance) {
    return await fastify.db.profiles.findMany();
  }

  public async fetchProfile(fastify: FastifyInstance, id: string) {
    const profile = await fastify.db.profiles.findOne({
      key: "id", equals: id
    })

    if (!profile) {
      throw fastify.httpErrors.notFound("Profile is not found");
    }

    return profile
  }
}

export default new ProfileResolver()

