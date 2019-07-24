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

describe('POST / (list all albums)', () => {
  test('List albums unauthenticated', () =>
    request(app)
      .get('/')
      .send({ query: '{ albums{ id, title} }' })
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
          .post('/')
          .send({ query: '{ albums{ id, title} }', token: response.body.token })
      )
      .then(response => {
        expect(response.body.data.albums.length).toBe(albumsAmount);
        expect(response.body.data.albums[0].id).toBe(id);
        expect(response.body.data.albums[0].title).toBe(albumTitle);
      });
  });
});
