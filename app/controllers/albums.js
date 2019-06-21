const { requestAlbums, requestAlbumPhotos } = require('../services/typicode'),
  { getEmailFromToken } = require('../helpers/token'),
  User = require('../models').user,
  logger = require('../logger'),
  Purchase = require('../models').purchase,
  { validationError, permissionError } = require('../errors');

exports.getAlbums = (req, res, next) => {
  requestAlbums()
    .then(json => {
      res.status(200).send(json);
    })
    .catch(next);
};

exports.getAlbumPhotos = (req, res, next) => {
  const albumId = req.params.id;
  requestAlbumPhotos(albumId)
    .then(json => {
      res.status(200).send(json);
    })
    .catch(next);
};

exports.buyAlbum = (req, res, next) => {
  const albumId = parseInt(req.params.id);
  logger.info(`Buying album with id ${albumId}`);
  getEmailFromToken(req.body.token)
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

exports.listAlbums = (req, res, next) =>
  getEmailFromToken(req.body.token)
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
