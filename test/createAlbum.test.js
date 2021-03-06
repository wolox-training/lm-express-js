const request = require('supertest'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  { createAlbumMock } = require('./support/mocking'),
  correctEmail = 'email@wolox.com.ar',
  correctPassword = 'password',
  albumTitle = 'new album title',
  albumBody = 'new album body';

describe('POST / (Create album)', () => {
  let validToken = '';
  beforeEach(() =>
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
            email: correctEmail,
            password: correctPassword
          })
      )
      .then(response => {
        validToken = response.body.token;
      })
  );

  test('Create album correctly', () => {
    createAlbumMock(albumTitle, albumBody);
    return request(app)
      .post('/')
      .send({
        query: `mutation { createAlbum (albumTitle:"${albumTitle}",albumBody:"${albumBody}"){id, title, body} }`,
        token: validToken
      })
      .then(response => {
        expect(response.body.data.createAlbum.id).toBe(101);
        expect(response.body.data.createAlbum.title).toBe(albumTitle);
        expect(response.body.data.createAlbum.body).toBe(albumBody);
      });
  });

  test('Create album without params', () =>
    request(app)
      .post('/')
      .send({
        query: 'mutation { createAlbum (){id, title, body} }',
        token: validToken
      })
      .then(response => {
        expect(response.body.errors[0].message).toMatch(/Syntax Error*/);
      }));
});
