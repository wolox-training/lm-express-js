const request = require('supertest'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  config = require('../config').common.token,
  { getIatFromToken } = require('../app/helpers/token'),
  jsrasign = require('jsrsasign'),
  correctPassword = 'password',
  correctEmail = 'sessiontime@wolox.com.ar',
  validationErrorStatus = 401;

const createExpiredToken = email => {
  const header = { alg: config.algorithm, typ: config.tokenType };
  const payload = {};
  payload.sub = email;
  payload.nbf = jsrasign.jws.IntDate.get('now') - 60;
  payload.iat = payload.nbf;
  payload.exp = payload.nbf;
  return jsrasign.jws.JWS.sign(config.algorithm, header, payload, config.pass);
};

describe('Sessions expiration time', () => {
  test('Create user, login, and check expiration time', () =>
    hashPassword(correctPassword)
      .then(pass =>
        factory.create('user', {
          email: correctEmail,
          password: pass
        })
      )
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: correctEmail,
            password: correctPassword
          })
      )
      .then(response => {
        const { token, sessionTime } = response.body;
        return getIatFromToken(token).then(tokenIat => {
          expect(sessionTime).toBe(tokenIat + config.sessionTime);
        });
      }));

  test('Create user, log in, and log in with expired token', () =>
    hashPassword(correctPassword)
      .then(pass =>
        factory.create('user', {
          email: correctEmail,
          password: pass
        })
      )
      .then(() => createExpiredToken(correctEmail))
      .then(expiredToken =>
        request(app)
          .get('/users')
          .send({
            token: expiredToken,
            page: 1,
            limit: 10
          })
      )
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      }));
});
