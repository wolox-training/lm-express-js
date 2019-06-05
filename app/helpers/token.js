const jsrasign = require('jsrsasign'),
  algorithm = 'HS256',
  tokenType = 'JWT',
  pass = 'c2VjcmV0';

exports.createToken = email => {
  const header = { alg: algorithm, typ: tokenType };
  const payload = {};
  payload.sub = email;
  payload.nbf = jsrasign.jws.IntDate.get('now');
  payload.iat = jsrasign.jws.IntDate.get('now');
  return jsrasign.jws.JWS.sign('HS256', header, payload, { b64: pass });
};
