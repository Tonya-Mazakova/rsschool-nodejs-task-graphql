import { FastifyInstance } from "fastify";

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
}

export default new PostResolver()
