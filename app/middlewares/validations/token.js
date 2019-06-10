const jsrasign = require('jsrsasign'),
  config = require('../../../config').common.token,
  { validationError, tokenError } = require('../../errors'),
  logger = require('../../logger');

exports.validateToken = (req, res, next) =>
  new Promise(resolve => {
    resolve(jsrasign.b64toutf8(req.body.token.split('.')[1]));
  })
    .then(jsonString => new Promise(resolve => resolve(JSON.parse(jsonString).sub)))
    .then(email =>
      jsrasign.jws.JWS.verifyJWT(req.body.token, config.pass, { alg: [config.algorithm], sub: [email] })
    )
    .then(validated => {
      if (validated) {
        logger.info('Token validated');
        next();
      } else {
        next(validationError("User doesn't have permissions to request users list"));
      }
    })
    .catch(error => {
      next(tokenError(error));
    });
