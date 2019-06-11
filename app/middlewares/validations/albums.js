const { validationError } = require('../../errors'),
  logger = require('../../logger'),
  { getAlbumById } = require('../../services/typicode');

exports.validateId = (req, res, next) => {
  const albumId = parseInt(req.params.id);
  if (albumId < 1) {
    return next(validationError('album id must be a positive integer'));
  }

  return getAlbumById(albumId)
    .then(() => {
      logger.info('albumId validated');
      return next();
    })
    .catch(next);
};
