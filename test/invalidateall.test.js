const request = require('supertest'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  correctPassword = 'password',
  correctEmail = 'invalidateall@wolox.com.ar',
  correctEmail2 = 'invalidateall2@wolox.com.ar',
  permissionErrorStatus = 401,
  User = require('../app/models').user,
  { notifySignUp } = require('../app/helpers/mailer');
jest.mock('../app/helpers/mailer');
notifySignUp.mockResolvedValue(true);

describe('POST /users/sessions/invalidate_all', () => {
  let token = '';
  beforeEach(() =>
    hashPassword(correctPassword)
      .then(pass =>
        Promise.all([
          factory.create('user', {
            email: correctEmail,
            password: pass
          }),
          factory.create('user', {
            email: correctEmail2,
            password: pass
          })
        ])
      )
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: correctEmail,
            password: correctPassword
          })
      )
      .then(response => ({ token } = response.body))
  );
  test('Test create two users, log in one of them, invalidate all sessions and log in with the other one', () =>
    request(app)
      .post('/users/sessions/invalidate_all')
      .send({ token })

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
                token: response.body.token,
                page: 1,
                limit: 10
              })
          )
          .then(response => {
            expect(response.status).toBe(200);
          })
      ));

  test('Test create two users, log in both of them, invalidate all sessions from one of them', () => {
    let token2 = '';
    return request(app)
      .post('/users/sessions')
      .send({
        email: correctEmail2,
        password: correctPassword
      })
      .then(response => {
        token2 = response.body.token;
      })
      .then(() =>
        request(app)
          .post('/users/sessions/invalidate_all')
          .send({ token })
      )
      .then(() =>
        User.findOne({ where: { email: correctEmail2 } }).then(foundUser => {
          expect(foundUser.invalidateTime).toBe(0);
        })
      )
      .then(() =>
        request(app)
          .get('/users')
          .send({
            token: token2,
            page: 1,
            limit: 10
          })
      )
      .then(response => {
        expect(response.status).toBe(200);
      });
  });
});
