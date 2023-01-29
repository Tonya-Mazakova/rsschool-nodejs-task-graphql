import { FastifyInstance } from "fastify";

class PostResolver {
  public async fetchPosts(fastify: FastifyInstance) {
    return await fastify.db.posts.findMany();
  }

  public async fetchPost(fastify: FastifyInstance, id: string) {
    const post = await fastify.db.posts.findOne({
      key: "id", equals: id
    })

    if (!post) {
      throw fastify.httpErrors.notFound("Post is not found");
    }

    return post
  }
}

export default new PostResolver()
