const { validationError } = require('../../errors'),
  logger = require('../../logger');

exports.validateId = (req, res, next) => {
  const albumId = parseInt(req.params.id);
  if (albumId < 1) {
    next(validationError('album id must be a positive integer'));
  }
  logger.info('albumId validated');
  return next();
};
