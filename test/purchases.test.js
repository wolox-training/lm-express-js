const request = require('supertest'),
  { requestAlbums } = require('../app/services/typicode'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  User = require('../app/models').user,
  { findPurchase } = require('../app/models/purchase'),
  { hashPassword } = require('../app/helpers/hasher'),
  validationErrorStatus = 401,
  apiErrorStatus = 502,
  tokenErrorStatus = 500,
  correctlyPurchasedStatus = 200,
  token = 'token',
  correctEmail = 'purchase@wolox.com.ar',
  correctPassword = 'password';

describe('POST /albums/:id', () => {
  describe('Test invalid inputs', () => {
    test('Send word as id', () =>
      request(app)
        .post('/albums/pepe')
        .send({ token })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Send 0 as id', () =>
      request(app)
        .post('/albums/0')
        .send({ token })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Send id of a non existing album', () =>
      requestAlbums()
        .then(albums =>
          request(app)
            .post(`/albums/${albums.length + 1}`)
            .send({ token })
        )
        .then(response => {
          expect(response.status).toBe(apiErrorStatus);
        }));

    test('Send a null token', () => {
      request(app)
        .post('/albums/1')
        .send({})
        .then(response => {
          expect(response.status).toBe(tokenErrorStatus);
        });
    });

    test('Send an invalid token', () => {
      request(app)
        .post('/albums/1')
        .send({ token })
        .then(response => {
          expect(response.status).toBe(tokenErrorStatus);
        });
    });
  });

  describe('Buy an album', () => {
    test('Buy an album and check db', () =>
      hashPassword(correctPassword)
        .then(pass =>
          factory.create('userNotAdmin', {
            email: correctEmail,
            password: pass
          })
        )
        .then(() =>
          request(app)
            .post('/users/sessions')
            .send({
              email: correctEmail,
              password: correctPassword
            })
        )
        .then(response =>
          request(app)
            .post('/albums/1')
            .send({
              token: response.text
            })
        )
        .then(response => {
          expect(response.status).toBe(correctlyPurchasedStatus);
          return User.findUserByEmail(correctEmail);
        })
        .then(foundUser => findPurchase(foundUser.id, 1))
        .then(foundPurchase => {
          expect(foundPurchase);
          expect(foundPurchase.albumId).toBe(1);
        }));
  });
});
