const request = require('supertest'),
  { requestAlbums } = require('../app/services/typicode'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  User = require('../app/models').user,
  Purchase = require('../app/models').purchase,
  { hashPassword } = require('../app/helpers/hasher'),
  validationErrorStatus = 401,
  apiErrorStatus = 502,
  tokenErrorStatus = 500,
  correctlyPurchasedStatus = 200,
  token = 'token',
  correctEmail = 'purchase@wolox.com.ar',
  correctPassword = 'password',
  albumId = 1,
  userId = 1;

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
    let validToken = '';
    beforeEach(() =>
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
        .then(response => {
          validToken = response.text;
        })
    );

    test('Buy an album and check db', () =>
      request(app)
        .post('/albums/1')
        .send({
          token: validToken
        })
        .then(response => {
          expect(response.status).toBe(correctlyPurchasedStatus);
          return User.findUserByEmail(correctEmail);
        })
        .then(foundUser => Purchase.findPurchase(foundUser.id, albumId))
        .then(foundPurchase => {
          expect(foundPurchase.albumId).toBe(albumId);
        }));

    test('Buy two albums with same user and check db', () =>
      request(app)
        .post('/albums/1')
        .send({
          token: validToken
        })
        .then(() =>
          request(app)
            .post('/albums/1')
            .send({
              token: validToken
            })
        )
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
          return Purchase.findAndCountAll({ where: { userId, albumId } });
        })
        .then(foundPurchases => {
          expect(foundPurchases.count).toBe(1);
        }));
  });
});
