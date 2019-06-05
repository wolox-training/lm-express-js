const jsrasign = require('jsrsasign'),
  { tokenError } = require('../errors'),
  algorithm = 'HS256',
  tokenType = 'JWT',
  pass = 'c2VjcmV0';

exports.createToken = email => {
  const header = { alg: algorithm, typ: tokenType };
  const payload = {};
  payload.sub = email;
  payload.nbf = jsrasign.jws.IntDate.get('now');
  payload.iat = jsrasign.jws.IntDate.get('now');
  return jsrasign.jws.JWS.sign('HS256', header, payload, pass);
};

exports.validateToken = token =>
  new Promise(resolve => {
    resolve(jsrasign.b64toutf8(token.split('.')[1]));
  })
    .then(jsonString => new Promise(resolve => resolve(JSON.parse(jsonString).sub)))
    .then(email => jsrasign.jws.JWS.verifyJWT(token, pass, { alg: [algorithm], sub: [email] }))
    .catch(error => {
      throw tokenError(error.message);
    });
