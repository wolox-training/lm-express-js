const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

exports.Album = new GraphQLObjectType({
  name: 'Album',
  fields: {
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    body: { type: GraphQLString }
  }
});

exports.Purchase = new GraphQLObjectType({
  name: 'Purchase',
  fields: {
    userId: { type: GraphQLInt },
    albumId: { type: GraphQLString }
  }
});
