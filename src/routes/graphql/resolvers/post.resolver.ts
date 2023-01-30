import { FastifyInstance } from "fastify";
import * as DataLoader from "dataloader";

class PostResolver {
  public async fetchPosts(fastify: FastifyInstance) {
    return await fastify.db.posts.findMany();
  }

  public async fetchPost(fastify: FastifyInstance, args: { id: string }) {
    const post = await fastify.db.posts.findOne({
      key: "id", equals: args?.id
    })

    if (!post) {
      throw fastify.httpErrors.notFound("Post is not found");
    }

    return post
  }

  public async createPost(fastify: FastifyInstance, args: {
    userId: string,
    title: string,
    content: string
  }) {
    return await fastify.db.posts.create(args)
  }

  public async updatePost(fastify: FastifyInstance, args: {
    id: string,
    title: string,
    content: string
  }) {
    const {id, ...body} = args

    const post =
      await fastify.db.posts.findOne({ key: 'id', equals: id });

    if (!post) {
      throw fastify.httpErrors.badRequest()
    }

    return fastify.db.posts.change(id, body);
  }

  public async getPostDataLoader(fastify: FastifyInstance) {
    return new DataLoader(async (userIDs) => {
      const posts = await fastify.db.posts.findMany()

      return userIDs?.map((userID) => posts?.find((post) => post?.userId === userID));
    })
  }
}

export default new PostResolver()
