const { requestAlbums, requestAlbumPhotos } = require('../services/typicode'),
  { getEmailFromToken } = require('../helpers/token'),
  User = require('../models').user,
  logger = require('../../logger');

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
    .then(foundUser => res.status(200).send(`userId: ${foundUser.id} - albumId: ${albumId}`))
    .catch(error => next(error));

  // If userId-albumId doesn't exists in albums db, add it. Otherwise throw and axception
};
