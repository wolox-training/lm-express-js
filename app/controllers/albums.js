const { requestAlbums, requestAlbumPhotos } = require('../services/typicode');

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

exports.buyAlbum = () => {
  // I have the albumId
  // const albumId = parseInt(req.params.id);
  // token->email->userId
  // If userId-albumId doesn't exists in albums db, add it. Otherwise throw and axception
};
