const jsrasign = require('jsrsasign'),
  config = require('../../config').common.token,
  { tokenError } = require('../errors');

exports.createToken = sub => {
  const header = { alg: config.algorithm, typ: config.tokenType };
  const payload = {};
  payload.sub = sub;
  payload.nbf = jsrasign.jws.IntDate.get('now');
  payload.iat = payload.nbf;
  return jsrasign.jws.JWS.sign(config.algorithm, header, payload, config.pass);
};

exports.validateToken = token =>
  new Promise(resolve => {
    resolve(jsrasign.b64toutf8(token.split('.')[1]));
  })
    .then(jsonString => new Promise(resolve => resolve(JSON.parse(jsonString).sub)))
    .then(email => jsrasign.jws.JWS.verifyJWT(token, config.pass, { alg: [config.algorithm], sub: [email] }))
    .catch(error => {
      throw tokenError(error.message);
    });
