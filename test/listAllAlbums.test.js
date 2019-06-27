const request = require('supertest'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  { albumsMock } = require('./support/mocking'),
  correctPassword = 'password',
  correctEmail = 'email@wolox.com.ar',
  albumTitle = 'quidem molestiae enim',
  albumsAmount = 1,
  id = 1,
  validationErrorStatus = 401;

describe('GET /albums', () => {
  test.todo('List albums without token');

  test('List albums unauthenticated', () =>
    request(app)
      .get('/albums')
      .send({})
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      }));

  test('List albums correctly', () => {
    albumsMock(id, albumTitle);
    return hashPassword(correctPassword)
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
            email: correctEmail,
            password: correctPassword
          })
      )
      .then(response =>
        request(app)
          .get('/albums')
          .send({ token: response.body.token })
      )
      .then(response => {
        expect(response.body.data.albumsList.length).toBe(albumsAmount);
        expect(response.body.data.albumsList[0].id).toBe(id);
        expect(response.body.data.albumsList[0].title).toBe(albumTitle);
      });
  });
});
