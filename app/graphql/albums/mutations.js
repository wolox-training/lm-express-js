const { getEmailFromToken } = require('../../helpers/token'),
  { GraphQLString, GraphQLInt } = require('graphql'),
  Purchase = require('../../models').purchase,
  User = require('../../models').user,
  { validationError } = require('../../errors'),
  { Album } = require('./types'),
  { createNewAlbum } = require('../../services/typicode');

const removePurchase = (token, albumId) =>
  getEmailFromToken(token)
    .then(email => User.findUserByEmail(email))
    .then(user =>
      Purchase.findPurchase(user.id, albumId).then(foundPurchase => {
        if (foundPurchase) {
          return Purchase.deletePurchase(user.id, albumId);
        }
        throw validationError("User doesn't have that album");
      })
    )
    .then(() => `Album with id ${albumId} removed`);

const createAlbum = (albumTitle, albumBody) => {
  if (albumTitle) {
    return createNewAlbum(albumTitle, albumBody);
  }
  throw validationError('albumTitle is required');
};

exports.removeAlbum = {
  name: 'removeAlbum',
  type: GraphQLString,
  args: {
    id: { type: GraphQLInt }
  },
  resolve: (obj, args, context) => removePurchase(context.body.token, args.id)
};

exports.createAlbum = {
  name: 'createAlbum',
  type: Album,
  args: {
    albumTitle: { type: GraphQLString },
    albumBody: { type: GraphQLString }
  },
  resolve: (obj, args) => createAlbum(args.albumTitle, args.albumBody)
};
