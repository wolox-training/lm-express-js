const { getEmailFromToken } = require('../../helpers/token'),
  { GraphQLString, GraphQLInt, GraphQLError } = require('graphql'),
  Purchase = require('../../models').purchase,
  User = require('../../models').user,
  { Album } = require('./types'),
  { createNewAlbum } = require('../../services/typicode'),
  { errorName } = require('../constants');

const removePurchase = (token, albumId) =>
  getEmailFromToken(token)
    .then(email => User.findUserByEmail(email))
    .then(user =>
      Purchase.findPurchase(user.id, albumId).then(foundPurchase => {
        if (foundPurchase) {
          return Purchase.deletePurchase(user.id, albumId);
        }
        throw new Error(errorName.VALIDATION_ERROR);
      })
    )
    .then(() => `Album with id ${albumId} removed`);

const createAlbum = (albumTitle, albumBody) => {
  if (albumTitle && albumBody) {
    return createNewAlbum(albumTitle, albumBody);
  }
  throw new Error(errorName.VALIDATION_ERROR);
};

exports.removeAlbum = {
  name: 'removeAlbum',
  type: GraphQLString,
  args: {
    id: { type: GraphQLInt }
  },
  resolve: (obj, args, context) =>
    removePurchase(context.body.token, args.id).catch(error => {
      throw new GraphQLError(error.message);
    })
};

exports.createAlbum = {
  name: 'createAlbum',
  type: Album,
  args: {
    albumTitle: { type: GraphQLString },
    albumBody: { type: GraphQLString }
  },
  resolve: (obj, args) =>
    createAlbum(args.albumTitle, args.albumBody).catch(error => {
      throw new GraphQLError(error.message);
    })
};
