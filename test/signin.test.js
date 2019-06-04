const request = require('supertest'),
  app = require('../app.js'),
  validationErrorStatus = 401,
  correctPassword = 'password',
  correctEmail = 'email@wolox.com.ar';

describe('POST /susers/sessions', () => {
  describe('Test missing parameters', () => {
    test.each([
      {
        email: correctEmail
      },
      {
        password: correctPassword
      },
      {}
    ])('Test missing parameter with body = %p', body =>
      request(app)
        .post('/users/sessions')
        .send(body)
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        })
    );
  });

  describe('Test invalid password', () => {
    test('Sign in with short password', () =>
      request(app)
        .post('/users/sessions')
        .send({
          email: correctEmail,
          password: 'pass'
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Sign in with password with invalid characters', () =>
      request(app)
        .post('/users/sessions')
        .send({
          email: correctEmail,
          password: 'passwo..rd'
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));
  });

  describe('Test invalid email', () => {
    test('Sign in with email with domain different from wolox', () =>
      request(app)
        .post('/users')
        .send({
          email: 'email@email.com.ar',
          password: correctPassword
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));
  });
});
