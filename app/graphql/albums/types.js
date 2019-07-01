const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLNonNull } = require('graphql');

exports.Album = new GraphQLObjectType({
  name: 'Album',
  fields: {
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    userId: { type: new GraphQLNonNull(GraphQLInt) }
  }
});

exports.Purchase = new GraphQLObjectType({
  name: 'Purchase',
  fields: {
    userId: { type: GraphQLInt },
    albumId: { type: GraphQLString }
  }
});
