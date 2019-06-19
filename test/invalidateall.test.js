const request = require('supertest'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  correctPassword = 'password',
  correctEmail = 'invalidateall@wolox.com.ar',
  correctEmail2 = 'invalidateall2@wolox.com.ar',
  permissionErrorStatus = 401,
  User = require('../app/models').user;

describe('POST /users/sessions/invalidate_all', () => {
  test('Test create two users, log in, invalidate al sessions from one of them', () => {
    let token = '';
    return hashPassword(correctPassword)
      .then(pass =>
        factory
          .create('user', {
            email: correctEmail,
            password: pass
          })
          .then(() =>
            factory.create('user', {
              email: correctEmail2,
              password: pass
            })
          )
      )
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: correctEmail,
            password: correctPassword
          })
      )
      .then(response => (token = response.text))
      .then(() =>
        request(app)
          .post('/users/sessions/invalidate_all')
          .send({ token })
      )
      .then(() =>
        User.findOne({ where: { email: correctEmail } }).then(foundUser => {
          expect(foundUser.invalidateTime).toBeGreaterThan(0);
        })
      )
      .then(() =>
        request(app)
          .get('/users')
          .send({
            token,
            page: 1,
            limit: 10
          })
      )
      .then(response => {
        expect(response.status).toBe(permissionErrorStatus);
      })
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: correctEmail2,
            password: correctPassword
          })
          .then(response =>
            request(app)
              .get('/users')
              .send({
                token: response.text,
                page: 1,
                limit: 10
              })
          )
          .then(response => {
            expect(response.status).toBe(200);
          })
      );
  });
});
