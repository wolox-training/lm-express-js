const request = require('supertest'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  config = require('../config').common.token,
  { getIatFromToken } = require('../app/helpers/token'),
  correctPassword = 'password',
  correctEmail = 'sessiontime@wolox.com.ar';

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

  /* test('Create user, log in, and log in with expired token', () =>
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

      }));*/
});
