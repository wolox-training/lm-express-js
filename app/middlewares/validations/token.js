const jsrasign = require('jsrsasign'),
  config = require('../../../config').common.token,
  { validationError, tokenError } = require('../../errors'),
  logger = require('../../logger'),
  { getEmailFromToken, getIatFromToken } = require('../../helpers/token'),
  User = require('../../models').user,
  moment = require('moment');

const validateWithEmail = (token, email) =>
  User.findUserByEmail(email).then(foundUser => {
    if (foundUser) {
      return getIatFromToken(token).then(tokenIat => {
        if (tokenIat > foundUser.invalidateTime) {
          return jsrasign.jws.JWS.verifyJWT(token, config.pass, {
            alg: [config.algorithm],
            sub: [email],
            verifyAt: moment().unix()
          });
        }
        return false;
      });
    }
    throw validationError('Invalid token. User does not exists');
  });

const resolveValidation = (validated, next) => {
  if (validated) {
    logger.info('Token validated');
    next();
  } else {
    next(validationError("User doesn't have needed permissions"));
  }
};

exports.validateToken = (req, res, next) =>
  getEmailFromToken(req.body.token)
    .then(email => validateWithEmail(req.body.token, email))
    .then(validated => resolveValidation(validated, next))
    .catch(error => next(tokenError(error)));

exports.checkNotNullToken = (req, res, next) => {
  if (!req.body.token) {
    return next(validationError('Null token'));
  }
  logger.info('Token not null');
  return next();
};
