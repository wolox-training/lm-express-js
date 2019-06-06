const jsrasign = require('jsrsasign'),
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
