import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLID
} from "graphql";

const postType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString), format: 'uuid' },
  })
})

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLID), description: "Post ID" },
    title: { type: new GraphQLNonNull(GraphQLString), description: "Post title" },
    content: { type: new GraphQLNonNull(GraphQLString), description: "Post description" },
  },
})

export { postType, CreatePostInput }
