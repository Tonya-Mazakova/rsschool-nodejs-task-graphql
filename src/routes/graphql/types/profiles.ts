import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType
} from "graphql";

const profileType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString), format: 'uuid' },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString)},
  })
})

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString), description: "User avatar" },
    sex: { type: new GraphQLNonNull(GraphQLString), description: "User sex" },
    birthday: { type: new GraphQLNonNull(GraphQLString), description: "User birthday" },
    country: { type: new GraphQLNonNull(GraphQLString), description: "User country" },
    street: { type: new GraphQLNonNull(GraphQLString), description: "User street" },
    city: { type: new GraphQLNonNull(GraphQLString), description: "User city" },
    userId: { type: new GraphQLNonNull(GraphQLString), description: "User ID" },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString), description: "Member type ID" }
  },
});

export { profileType, CreateProfileInput };
