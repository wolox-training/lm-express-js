const { getEmailFromToken } = require('../../helpers/token'),
  { GraphQLString } = require('graphql'),
  Purchase = require('../../models').purchase,
  User = require('../../models').user;

const removePurchase = (token, albumId) =>
  getEmailFromToken(token)
    .then(email => User.findUserByEmail(email))
    .then(user => Purchase.deletePurchase(user.id, albumId));

exports.removeAlbum = {
  name: 'removeAlbum',
  fields: {
    removePurchase: {
      type: GraphQLString,
      resolve(token, albumId) {
        return removePurchase(token, albumId);
      }
    }
  }
};
