const jsrasign = require('jsrsasign'),
  config = require('../../config').common.token,
  { tokenError } = require('../../app/errors');

exports.createToken = sub => {
  const header = { alg: config.algorithm, typ: config.tokenType };
  const payload = {};
  payload.sub = sub;
  payload.nbf = jsrasign.jws.IntDate.get('now');
  payload.iat = payload.nbf;
  payload.exp = payload.nbf + config.sessionTime;
  return jsrasign.jws.JWS.sign(config.algorithm, header, payload, config.pass);
};

exports.getEmailFromToken = token =>
  new Promise(resolve => {
    resolve(jsrasign.b64toutf8(token.split('.')[1]));
  })
    .then(jsonString => new Promise(resolve => resolve(JSON.parse(jsonString).sub)))
    .catch(error => tokenError(error));

exports.getIatFromToken = token =>
  new Promise(resolve => {
    resolve(jsrasign.b64toutf8(token.split('.')[1]));
  })
    .then(jsonString => new Promise(resolve => resolve(JSON.parse(jsonString).iat)))
    .catch(error => tokenError(error));

exports.getExpFromToken = token =>
  new Promise(resolve => {
    resolve(jsrasign.b64toutf8(token.split('.')[1]));
  })
    .then(jsonString => new Promise(resolve => resolve(JSON.parse(jsonString).exp)))
    .catch(error => tokenError(error));
