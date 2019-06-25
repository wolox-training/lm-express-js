const request = require('supertest'),
  app = require('../app.js'),
  validationErrorStatus = 401,
  correctlyUpdatedStatus = 200,
  correctlyCreatedStatus = 200,
  User = require('../app/models').user,
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  firstName = 'fn',
  lastName = 'ln',
  correctPassword = 'password',
  correctEmail = 'email@wolox.com.ar',
  correctAdminEmail = 'emailAdmin@wolox.com.ar',
  badToken = 'token',
  { notifySignUp } = require('../app/helpers/mailer');

jest.mock('../app/helpers/mailer');
notifySignUp.mockResolvedValue(true);

describe('POST /admin/users', () => {
  beforeEach(() =>
    hashPassword(correctPassword).then(pass =>
      factory.create('userAdmin', {
        email: correctAdminEmail,
        password: pass
      })
    )
  );

  describe('Test invalid password', () => {
    test('Create user with short password', () =>
      request(app)
        .post('/admin/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: correctEmail,
          password: 'pass',
          token: badToken
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Create user with password with invalid characters', () =>
      request(app)
        .post('/admin/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: correctEmail,
          password: 'passwo..rd',
          token: badToken
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));
  });

  describe('Test invalid email', () => {
    test('Create user with email with domain different from wolox', () =>
      request(app)
        .post('/admin/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: 'email@email.com.ar',
          password: correctPassword,
          token: badToken
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));
  });

  describe('Test used mail to change permissions', () => {
    test('Create not-admin user and change permissions', () =>
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
              email: correctAdminEmail,
              password: correctPassword
            })
        )
        .then(response =>
          request(app)
            .post('/admin/users')
            .send({
              first_name: firstName,
              last_name: lastName,
              email: correctEmail,
              password: correctPassword,
              token: response.body.token
            })
        )
        .then(response => {
          expect(response.status).toBe(correctlyUpdatedStatus);
          return User.findOne({ where: { email: correctEmail } }).then(foundUser => {
            expect(foundUser.isAdmin).toBe(true);
          });
        }));

    test('Create admin user and check permissions after post /admin/users', () =>
      request(app)
        .post('/users/sessions')
        .send({
          email: correctAdminEmail,
          password: correctPassword
        })
        .then(response =>
          request(app)
            .post('/admin/users')
            .send({
              first_name: firstName,
              last_name: lastName,
              email: correctAdminEmail,
              password: correctPassword,
              token: response.body.token
            })
        )
        .then(response => {
          expect(response.status).toBe(correctlyUpdatedStatus);
          return User.findOne({ where: { email: correctAdminEmail } }).then(foundUser => {
            expect(foundUser.isAdmin).toBe(true);
          });
        }));
  });

  describe('Test create user admin', () => {
    test('Create user admin with new email', () =>
      request(app)
        .post('/users/sessions')
        .send({
          email: correctAdminEmail,
          password: correctPassword
        })

        .then(response =>
          request(app)
            .post('/admin/users')
            .send({
              first_name: firstName,
              last_name: lastName,
              email: correctEmail,
              password: correctPassword,
              token: response.body.token
            })
        )
        .then(response => {
          expect(response.status).toBe(correctlyCreatedStatus);
          return User.findOne({ where: { email: correctEmail } }).then(foundUser => {
            expect(foundUser.isAdmin).toBe(true);
          });
        }));
  });
});
