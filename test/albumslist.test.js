const request = require('supertest'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  User = require('../app/models').user,
  { albumsListMock } = require('./support/mocking'),
  correctEmail = 'albumslist@wolox.com.ar',
  correctEmail2 = 'albumlists2@wolox.com.ar',
  correctPassword = 'password',
  albumTitle = 'quidem molestiae enim',
  validationErrorStatus = 401,
  permissionErrorStatus = 403,
  tokenErrorStatus = 500;

const buyTwoAlbums = (id1, id2, buyerToken) => {
  albumsListMock(1, albumTitle);
  albumsListMock(10, albumTitle);
  return request(app)
    .post(`/albums/${id1}`)
    .send({ token: buyerToken })
    .then(() =>
      request(app)
        .post(`/albums/${id2}`)
        .send({ token: buyerToken })
    );
};

const checkBoughtAlbums = (response, id1, id2) => {
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
  expect(response.body[0].albumId).toBe(id1);
  expect(response.body[1].albumId).toBe(id2);
  expect(response.body[0].albumName).toBe(albumTitle);
  expect(response.body[1].albumName).toBe(albumTitle);
};

describe('GET /users/:user_id/albums', () => {
  describe('Test missing parameters', () => {
    test('Test missing user_id', () =>
      request(app)
        .get('/users/ /albums')
        .send({ token: 'token' })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Test missing token', () =>
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
        }));
  });

  describe('Test invalid inputs', () => {
    test('Test send an invalid user_id', () =>
      request(app)
        .get('/users/pepe/albums')
        .send({ token: 'token' })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));
    test('Test send an invalid user_id (id bigger than users amount)', () =>
      request(app)
        .get('/users/5/albums')
        .send({ token: 'token' })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));
  });

  describe('Test endpoint unauthenticated', () => {
    test('Test request with valid user_id an invalid token', () =>
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
            .send({ token: 'token' })
        )

        .then(response => {
          expect(response.status).toBe(tokenErrorStatus);
        }));
  });

  describe('Test buy albums', () => {
    let validToken = '';
    let validToken1 = '';
    let validToken2 = '';

    const askForAlbums = (userId, token) => {
      albumsListMock(1, albumTitle);
      albumsListMock(10, albumTitle);
      return request(app)
        .get(`/users/${userId}/albums`)
        .send({ token });
    };

    const requestToken = () =>
      request(app)
        .post('/users/sessions')
        .send({
          email: correctEmail,
          password: correctPassword
        })
        .then(response => (validToken = response.text));

    const requestTokens = () =>
      request(app)
        .post('/users/sessions')
        .send({
          email: correctEmail,
          password: correctPassword
        })
        .then(response => (validToken1 = response.text))
        .then(() =>
          request(app)
            .post('/users/sessions')
            .send({
              email: correctEmail2,
              password: correctPassword
            })
        )
        .then(response => (validToken2 = response.text));

    test('Test buy album and list albums with same admin user', () =>
      hashPassword(correctPassword)
        .then(pass =>
          factory.create('userAdmin', {
            email: correctEmail,
            password: pass
          })
        )
        .then(() => requestToken())
        .then(() => User.findUserByEmail(correctEmail))
        .then(user => buyTwoAlbums(1, 10, validToken).then(() => askForAlbums(user.id, validToken)))
        .then(response => checkBoughtAlbums(response, 1, 10)));

    test('Test buy album and list albums with same not-admin user', () =>
      hashPassword(correctPassword)
        .then(pass =>
          factory.create('userNotAdmin', {
            email: correctEmail,
            password: pass
          })
        )
        .then(() => requestToken())
        .then(() => User.findUserByEmail(correctEmail))
        .then(user => buyTwoAlbums(1, 10, validToken).then(() => askForAlbums(user.id, validToken)))
        .then(response => checkBoughtAlbums(response, 1, 10)));

    test('Test buy album and list albums with different not-admin user', () =>
      hashPassword(correctPassword)
        .then(pass =>
          factory
            .create('userNotAdmin', {
              email: correctEmail,
              password: pass
            })
            .then(() =>
              factory.create('userNotAdmin', {
                email: correctEmail2,
                password: pass
              })
            )
        )
        .then(() => requestTokens())
        .then(() => User.findUserByEmail(correctEmail2))
        .then(user => buyTwoAlbums(1, 10, validToken2).then(() => askForAlbums(user.id, validToken1)))
        .then(response => {
          expect(response.status).toBe(permissionErrorStatus);
        }));

    test('Test buy album and list albums with different admin user', () =>
      hashPassword(correctPassword)
        .then(pass =>
          factory
            .create('userAdmin', {
              email: correctEmail,
              password: pass
            })
            .then(() =>
              factory.create('userNotAdmin', {
                email: correctEmail2,
                password: pass
              })
            )
        )
        .then(() => requestTokens())
        .then(() => User.findUserByEmail(correctEmail2))
        .then(user => buyTwoAlbums(1, 10, validToken2).then(() => askForAlbums(user.id, validToken1)))
        .then(response => checkBoughtAlbums(response, 1, 10)));
  });
});
