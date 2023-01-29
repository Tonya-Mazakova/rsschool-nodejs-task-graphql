import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} from "graphql";

export const postType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString), format: 'uuid' },
  })
})
