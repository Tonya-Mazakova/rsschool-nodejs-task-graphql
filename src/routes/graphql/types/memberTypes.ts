import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType
} from "graphql";

const memberType = new GraphQLObjectType({
  name: "MemberType",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
  })
})

const UpdateMemberTypeInput = new GraphQLInputObjectType({
  name: 'UpdateMemberTypeInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
})

export { memberType, UpdateMemberTypeInput }
