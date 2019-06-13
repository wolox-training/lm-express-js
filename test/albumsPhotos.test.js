const request = require('supertest'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  { requestAlbumPhotos } = require('../app/services/typicode'),
  correctEmail = 'albumslist@wolox.com.ar',
  correctPassword = 'password',
  validationErrorStatus = 401;

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
      .then(() => factory.create('purchase', { albumId: 10, userId: 1 }))
      .then(() =>
        request(app)
          .post('/users/sessions')
          .send({
            email: correctEmail,
            password: correctPassword
          })
      )
      .then(response => (token = response.text))
  );

  test('Test create user, buy albums and list photos of a non-purchased album', () =>
    request(app)
      .get('/users/albums/2/photos')
      .send({
        token
      })
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      }));

  test('Test create user, buy albums and list photos', () =>
    request(app)
      .get('/users/albums/10/photos')
      .send({
        token
      })
      .then(response => {
        const photos = response.body;
        expect(response.status).toBe(200);
        expect(photos.length).toBeGreaterThan(0);

        for (let i = 0; i < photos.length; i++) {
          expect(photos[i].albumId).toBe(10);
          expect(photos[i].url);
          expect(photos[i].thumbnailUrl);
        }
        return requestAlbumPhotos(10).then(servicePhotos => {
          expect(servicePhotos).toEqual(photos);
        });
      }));
});
