const { requestAlbums, requestAlbumPhotos } = require('../services/typicode'),
  { getEmailFromToken } = require('../helpers/token'),
  User = require('../models').user,
  logger = require('../logger'),
  Purchase = require('../models/purchase'),
  { validationError } = require('../errors');

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
        Purchase.bougthAlbum(foundUser.ID, albumId);
      } else {
        throw validationError('Token does not match with any user');
      }
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
