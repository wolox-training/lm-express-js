const request = require('supertest'),
  app = require('../app.js'),
  validationErrorStatus = 401,
  firstName = 'fn1',
  lastName = 'ln1',
  correctPassword = 'password',
  correctEmail = 'email@wolox.com.ar';

describe('GET /users', () => {
  describe('Test invalid inputs', () => {
    test('Test invalid offset', () => {
      request(app)
        .get('/users')
        .send({
          token: 'token',
          offset: -5,
          limit: 10
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        });
    });

    test('Test invalid limit', () => {
      request(app)
        .get('/users')
        .send({
          token: 'token',
          offset: 10,
          limit: -5
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        });
    });

    test('Test invalid token', () => {
      request(app)
        .get('/users')
        .send({
          token: 'token',
          offset: 10,
          limit: 8
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        });
    });
  });

  /* describe('Test missing parameters', () => {
    test.each([
      {
        offset: 10,
        limit: -5
      },
      {
        token: 'token',
        limit: -5
      },
      {
        token: 'token',
        offset: 10
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
  });*/
  describe('Test valid token', () => {
    test('Create user and list users with valid token', () => {
      request(app)
        .post('/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: correctEmail,
          password: correctPassword
        })
        .then(() =>
          request(app)
            .post('/users/sessions')
            .send({
              email: correctEmail,
              password: correctPassword
            })
        )
        .then(response => {
          request(app)
            .get('/users')
            .send({
              token: response.body.token,
              offset: 10,
              limit: 10
            })
            .then(response2 => {
              expect(response2.status).toBe(200);
              console.log(response2);
            });
        });
    });
  });
});
