const request = require('supertest'),
  app = require('../app.js'),
  validationErrorStatus = 401,
  correctlyUpdatedStatus = 200,
  correctlyCreatedStatus = 200,
  User = require('../app/models').user,
  { factory } = require('factory-girl'),
  firstName = 'fn',
  lastName = 'ln',
  correctPassword = 'password',
  correctEmail = 'email@wolox.com.ar';

describe('POST /admin/users', () => {
  describe('Test invalid password', () => {
    test('Create user with short password', () =>
      request(app)
        .post('/admin/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: correctEmail,
          password: 'pass'
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
          password: 'passwo..rd'
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
          password: correctPassword
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));
  });

  describe('Test used mail to change permissions', () => {
    test('Create not-admin user and change permissions', () => {
      factory.define('userNotAdmin', User, buildOptions => ({
        first_name: buildOptions.firstName,
        last_name: buildOptions.lastName,
        email: buildOptions.email,
        password: buildOptions.password,
        isAdmin: false
      }));
      return factory
        .create('userNotAdmin', { firstName, lastName, email: correctEmail, password: correctPassword })
        .then(() =>
          request(app)
            .post('/admin/users')
            .send({
              first_name: firstName,
              last_name: lastName,
              email: correctEmail,
              password: correctPassword
            })
        )
        .then(response => {
          expect(response.status).toBe(correctlyUpdatedStatus);
          return User.findOne({ where: { email: correctEmail } }).then(foundUser => {
            expect(foundUser.isAdmin).toBe(true);
          });
        });
    });

    test('Create admin user and check permissions after post /admin/users', () => {
      factory.define('userAdmin', User, buildOptions => ({
        first_name: buildOptions.firstName,
        last_name: buildOptions.lastName,
        email: buildOptions.email,
        password: buildOptions.password,
        isAdmin: true
      }));
      return factory
        .create('userAdmin', { firstName, lastName, email: correctEmail, password: correctPassword })
        .then(() =>
          request(app)
            .post('/admin/users')
            .send({
              first_name: firstName,
              last_name: lastName,
              email: correctEmail,
              password: correctPassword
            })
        )
        .then(response => {
          expect(response.status).toBe(correctlyUpdatedStatus);
          return User.findOne({ where: { email: correctEmail } }).then(foundUser => {
            expect(foundUser.isAdmin).toBe(true);
          });
        });
    });
  });

  describe('Test create user admin', () => {
    test('Create user admin with new email', () =>
      request(app)
        .post('/admin/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: correctEmail,
          password: correctPassword
        })
        .then(response => {
          expect(response.status).toBe(correctlyCreatedStatus);
          User.findOne({ where: { email: correctEmail } }).then(foundUser => {
            expect(foundUser.isAdmin).toBe(true);
          });
        }));
  });
});
