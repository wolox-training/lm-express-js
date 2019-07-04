const request = require('supertest'),
  app = require('../app.js'),
  validationErrorStatus = 401,
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  firstName = 'fn',
  lastName = 'ln',
  correctPassword = 'password';

describe('GET /users', () => {
  describe('Test invalid inputs', () => {
    test('Test invalid page', () =>
      request(app)
        .get('/users')
        .send({
          token: 'token',
          page: -5,
          limit: 10
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Test invalid limit', () =>
      request(app)
        .get('/users')
        .send({
          token: 'token',
          page: 10,
          limit: -5
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Test invalid token', () =>
      request(app)
        .get('/users')
        .send({
          token: 'token',
          page: 10,
          limit: 8
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));
  });

  describe('Test missing parameters', () => {
    test.each([
      {
        token: 'token',
        page: 10
      },
      {
        token: 'token',
        limit: 10
      },
      {
        page: 10,
        limit: 10
      },
      {}
    ])('Test missing parameter with body = %p', body =>
      request(app)
        .get('/users')
        .send(body)
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        })
    );
  });

  describe('Test token validation', () => {
    test('Create user, and ask users list with correct token', () =>
      hashPassword(correctPassword)
        .then(pass =>
          factory.create('user', {
            firstName,
            lastName,
            email: 'pruebaToken@wolox.com.ar',
            password: pass
          })
        )
        .then(() =>
          request(app)
            .post('/users/sessions')
            .send({
              email: 'pruebaToken@wolox.com.ar',
              password: correctPassword
            })
        )
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
          expect(response.body.length).toBe(1);
          expect(response.body[0].email).toBe('pruebaToken@wolox.com.ar');
          expect(response.status);
        }));
  });
});
