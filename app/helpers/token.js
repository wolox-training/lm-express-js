const jsrasign = require('jsrsasign'),
  { tokenError } = require('../errors'),
  algorithm = process.env.TOKEN_ALGORITHM,
  tokenType = process.env.TOKEN_TYPE,
  pass = process.env.TOKEN_PASS;

exports.createToken = sub => {
  const header = { alg: algorithm, typ: tokenType };
  const payload = {};
  payload.sub = sub;
  payload.nbf = jsrasign.jws.IntDate.get('now');
  payload.iat = payload.nbf;
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
