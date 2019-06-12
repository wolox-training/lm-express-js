const request = require('supertest'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  correctEmail = 'albumslist@wolox.com.ar',
  correctEmail2 = 'albumlists2@wolox.com.ar',
  correctPassword = 'password',
  validationErrorStatus = 401,
  tokenErrorStatus = 500;
// Test missing parameters
// Test invalid inputs
// Test endpoint unauthenticated
// Test buy albums and list albums with same user
// Test buy albums and list albums with different not-admin user
// Test buy albums and list albums with different admin user

describe('GET /users/:user_id/albums', () => {
  describe('Test missing parameters', () => {
    test('Test missing user_id', () => {
      request(app)
        .get('/users/ /albums')
        .send({ token: 'token' })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        });
    });

    test('Test missing token', () => {
      hashPassword(correctPassword)
        .then(pass =>
          factory.create('userNotAdmin', {
            email: correctEmail,
            password: pass
          })
        )
        .then(() =>
          request(app)
            .get('/users/1/albums')
            .send({})
        )
        .then(response => {
          expect(response.status).toBe(tokenErrorStatus);
        });
    });
  });

  describe('Test invalid inputs', () => {
    test('Test send an invalid user_id', () => {
      request(app)
        .get('/users/pepe/albums')
        .send({ token: 'token' })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        });
    });
    test('Test send an invalid user_id (id bigger than users amount)', () => {
      request(app)
        .get('/users/5/albums')
        .send({ token: 'token' })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        });
    });
  });

  describe('Test endpoint unauthenticated', () => {
    test('Test request with vali user_id an invalid token', () => {
      hashPassword(correctPassword)
        .then(pass =>
          factory.create('userNotAdmin', {
            email: correctEmail2,
            password: pass
          })
        )
        .then(() =>
          request(app)
            .get('/users/1/albums')
            .send({ token: 'token' })
        )
        .then(response => {
          expect(response.status).toBe(tokenErrorStatus);
        });
    });
  });
  // PREGUNTAR POR QUÉ TENGO QUE USAR UN MAIL DISTINTO, Y EN LAS PRUEBAS ANTERIORES NO.
});
