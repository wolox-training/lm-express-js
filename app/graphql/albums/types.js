const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

exports.Album = new GraphQLObjectType({
  name: 'Album',
  fields: {
    id: { type: GraphQLInt },
    title: { type: GraphQLString }
  }
});
