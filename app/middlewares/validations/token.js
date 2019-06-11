const jsrasign = require('jsrsasign'),
  config = require('../../../config').common.token,
  { validationError, tokenError } = require('../../errors'),
  logger = require('../../logger'),
  User = require('../../models').user;

const getEmailFromToken = token =>
  new Promise(resolve => {
    resolve(jsrasign.b64toutf8(token.split('.')[1]));
  }).then(jsonString => new Promise(resolve => resolve(JSON.parse(jsonString).sub)));

const validateWithEmail = (token, email) =>
  jsrasign.jws.JWS.verifyJWT(token, config.pass, { alg: [config.algorithm], sub: [email] });

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

exports.validateAdminToken = (req, res, next) => {
  getEmailFromToken(req.body.token)
    .then(email => User.findOne({ where: { email, isAdmin: true } }))
    .then(foundUser => validateWithEmail(req.body.token, foundUser.email))
    .then(validated => resolveValidation(validated, next))
    .catch(error => next(tokenError(error)));
};
