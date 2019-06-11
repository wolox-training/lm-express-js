const { validationError } = require('../../errors'),
  logger = require('../../logger'),
  { getAlbumById } = require('../../services/typicode');

exports.validateId = (req, res, next) => {
  if (isNaN(req.params.id) || req.params.id < 1) {
    return next(validationError('album id must be a positive integer'));
  }
  const albumId = parseInt(req.params.id);

  return getAlbumById(albumId)
    .then(() => {
      logger.info('albumId validated');
      return next();
    })
    .catch(next);
};
