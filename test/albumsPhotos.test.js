const request = require('supertest'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  { requestAlbumPhotos } = require('../app/services/typicode'),
  { albumsListMock, albumsPhotosListMockError, albumsPhotosListMock } = require('./support/mocking'),
  correctEmail = 'albumslist@wolox.com.ar',
  correctPassword = 'password',
  albumTitle = 'quidem molestiae enim',
  validationErrorStatus = 401,
  albumId = 10,
  albumIdNotPurchased = 1;

describe('GET /users/albums/:id/photos', () => {
  let token = '';
  beforeEach(() =>
    hashPassword(correctPassword)
      .then(pass =>
        factory.create('userAdmin', {
          email: correctEmail,
          password: pass
        })
      )
      .then(() => factory.create('purchase', { albumId, userId: 1 }))
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: correctEmail,
            password: correctPassword
          })
      )
      .then(response => ({ token } = response.body))
  );

  test('Test create user, buy albums and list photos of a non-purchased album', () => {
    albumsListMock(albumIdNotPurchased, albumTitle);
    albumsPhotosListMockError(albumIdNotPurchased);
    return request(app)
      .get(`/users/albums/${albumIdNotPurchased}/photos`)
      .send({
        token
      })
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      });
  });

  test('Test create user, buy albums and list photos', () => {
    albumsListMock(albumId, albumTitle);
    albumsPhotosListMock(albumId);
    return request(app)
      .get(`/users/albums/${albumId}/photos`)
      .send({
        token
      })
      .then(response => {
        const photos = response.body;
        expect(response.status).toBe(200);
        expect(photos.length).toBeGreaterThan(0);
        albumsPhotosListMock(albumId);
        for (let i = 0; i < photos.length; i++) {
          expect(photos[i].albumId).toBe(albumId);
          expect(photos[i].url);
          expect(photos[i].thumbnailUrl);
        }
        return requestAlbumPhotos(albumId).then(servicePhotos => {
          expect(servicePhotos).toEqual(photos);
        });
      });
  });
});
