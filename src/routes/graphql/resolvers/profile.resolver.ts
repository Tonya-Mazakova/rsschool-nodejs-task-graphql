import { FastifyInstance } from "fastify";
import * as DataLoader from "dataloader";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";

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

  public async getProfileDataLoader(fastify: FastifyInstance) {
    return new DataLoader(async (userIDs) => {
      const profiles = await fastify.db.profiles.findMany();

      let found
      const result = userIDs.reduce((acc: any, currentUserID) => {
        found = profiles?.find((profile) => profile.userId === currentUserID)

        if (found) {
          acc.push(found)
        }

        return acc
      }, [])

      return result as ProfileEntity[]
    })
  }
}

export default new ProfileResolver()

