const request = require('supertest'),
  app = require('../app.js'),
  validationErrorStatus = 401,
  firstName = 'fn1',
  lastName = 'ln1',
  correctPassword = 'password',
  correctEmail = 'email@wolox.com.ar',
  correctEmail1 = 'email2@wolox.com.ar',
  { notifySignUp } = require('../app/helpers/mailer');

jest.mock('../app/helpers/mailer');
notifySignUp.mockResolvedValue(true);

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

    test('Valid user but not matching password', () => {
      request(app)
        .post('/users')
        .send({
          email: correctEmail,
          password: correctPassword
        })
        .then(() =>
          request(app)
            .post('/users/sessions')
            .send({
              email: correctEmail,
              password: 'notMatchingPassword'
            })
            .then(response => {
              expect(response.status).toBe(validationErrorStatus);
            })
        );
    });
  });

  describe('Test invalid email', () => {
    test('Sign in with email with domain different from wolox', () =>
      request(app)
        .post('/users/sessions')
        .send({
          email: 'email@email.com.ar',
          password: correctPassword
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Sign in with unregistered email', () => {
      request(app)
        .post('/users/sessions')
        .send({
          email: 'unregisteredemail@wolox.com.ar',
          password: correctPassword
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        });
    });
  });

  describe('Test correct sign in', () => {
    test('Sign in correctly and check that token is generated', () => {
      request(app)
        .post('/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: correctEmail1,
          password: correctPassword
        })
        .then(() =>
          request(app)
            .post('/users/sessions')
            .send({
              email: correctEmail1,
              password: correctPassword
            })
            .then(response => {
              expect(response.status).toBe(200);
              expect(response.text.length).toBeGreaterThan(0);
            })
        );
    });
  });
});
