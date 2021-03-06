const { GraphQLSchema, GraphQLObjectType } = require('graphql'),
  albums = require('./albums');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...albums.queries
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...albums.mutations
    }
  })
});
