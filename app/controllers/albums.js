const { requestAlbums, requestAlbumPhotos } = require('../services/typicode'),
  { getEmailFromToken } = require('../helpers/token'),
  User = require('../models').user,
  logger = require('../logger'),
  Purchase = require('../models').purchase,
  { validationError, permissionError } = require('../errors'),
  { graphql, GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLString } = require('graphql'),
  { Album } = require('../helpers/types');

exports.getAlbums = (req, res, next) => {
  logger.info('Listing all albums');

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'albumsQuery',
      fields: {
        albumsList: {
          type: new GraphQLList(Album),
          resolve() {
            return requestAlbums().then(json => json);
          }
        }
      }
    })
  });

  return graphql(schema, '{ albumsList { id, title } }')
    .then(response => {
      res.status(200).send(response);
    })
    .catch(next);
};

exports.getAlbumPhotos = (req, res, next) => {
  const albumId = req.params.id;
  return requestAlbumPhotos(albumId)
    .then(json => {
      res.status(200).send(json);
    })
    .catch(next);
};

exports.buyAlbum = (req, res, next) => {
  const albumId = parseInt(req.params.id);
  logger.info(`Buying album with id ${albumId}`);
  return getEmailFromToken(req.body.token)
    .then(email => User.findUserByEmail(email))
    .then(foundUser => {
      if (foundUser) {
        return Purchase.buyAlbumWithUserId(foundUser.id, albumId);
      }
      throw validationError('Token does not match with any user');
    })
    .then(([bought, created]) => {
      if (created) {
        logger.info(`Album ${albumId} bougth`);
        res.status(200).send(`userId: ${bought.userId} bought albumId: ${albumId}`);
      } else {
        throw validationError('User already bought that album');
      }
    })
    .catch(next);
};

exports.listAlbums = (req, res, next) => {
  logger.info(`Attempting to list albums of user with id ${req.params.user_id}`);
  return getEmailFromToken(req.body.token)
    .then(applicantEmail => User.findUserByEmail(applicantEmail))
    .then(applicantUser => {
      if (!applicantUser) {
        throw validationError('Token does not match with any user');
      } else if (parseInt(req.params.user_id) === applicantUser.id || applicantUser.isAdmin) {
        logger.info(`Listing albums of user with id ${req.params.user_id}`);
        return Purchase.getAlbumsWithUserId(req.params.user_id).then(purchasedAlbums =>
          res.status(200).send(purchasedAlbums)
        );
      } else {
        throw permissionError('Admin permissions are required');
      }
    })
    .catch(next);
};

exports.listAlbumsPhotos = (req, res, next) => {
  logger.info(`Attempting to list photos of album with id ${req.params.id}`);
  const albumId = parseInt(req.params.id);
  return getEmailFromToken(req.body.token)
    .then(email => User.findUserByEmail(email))
    .then(user =>
      Purchase.findPurchase(user.id, albumId).then(foundPurchase => {
        if (foundPurchase) {
          return requestAlbumPhotos(albumId).then(albumPhotos => {
            logger.info(`Listing albums photos of album with id ${albumId}`);
            res.status(200).send(albumPhotos);
          });
        }
        throw validationError(`User with id ${user.id} didn't buy album with id ${albumId}`);
      })
    )
    .catch(next);
};

exports.removePurchase = (req, res, next) => {
  logger.info(`Removing purchase of album with id ${req.params.id}`);

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'removePurchaseQuery',
      fields: {
        removePurchase: {
          type: GraphQLString,
          resolve() {
            return getEmailFromToken(req.body.token)
              .then(email => User.findUserByEmail(email))
              .then(user => Purchase.deletePurchase(user.id, req.params.id));
          }
        }
      }
    })
  });

  return graphql(schema, '{ removePurchase }')
    .then(response => {
      console.log(response);
      res.status(200).send(response);
    })
    .catch(next);
};
