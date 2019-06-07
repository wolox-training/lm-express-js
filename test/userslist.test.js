const request = require('supertest'),
  app = require('../app.js'),
  validationErrorStatus = 401;

describe('GET /users', () => {
  describe('Test invalid inputs', () => {
    test('Test invalid offset', () =>
      request(app)
        .get('/users')
        .query({
          token: 'token',
          offset: -5,
          limit: 10
        })
        .send()
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Test invalid limit', () =>
      request(app)
        .get('/users')
        .send({
          token: 'token',
          offset: 10,
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
          offset: 10,
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
        offset: 10
      },
      {
        token: 'token',
        limit: 10
      },
      {
        offset: 10,
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
      request(app)
        .post('/users')
        .send({
          first_name: 'fn',
          last_name: 'ln',
          email: 'prueba@wolox.com.ar',
          password: 'password'
        })
        .then(() =>
          request(app)
            .post('/users/sessions')
            .send({
              email: 'prueba@wolox.com.ar',
              password: 'password'
            })
        )
        .then(response =>
          request(app)
            .get('/users')
            .query({
              token: response.text,
              offset: 0,
              limit: 10
            })
            .send()
        )
        .then(response => {
          expect(JSON.parse(response.text).rows.length).toBeGreaterThan(0);
          expect(response.status).toBe(200);
        }));
  });
});
