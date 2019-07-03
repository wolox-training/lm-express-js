const request = require('supertest'),
  app = require('../app.js'),
  { factory } = require('factory-girl'),
  { hashPassword } = require('../app/helpers/hasher'),
  correctPassword = 'password',
  correctEmail = 'email@wolox.com.ar';

describe('POST / (remove album)', () => {
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

  test('Remove unpurchased album', () =>
    request(app)
      .post('/')
      .send({ query: '{ mutation removeAlbum(id:1) }', token: validToken })
      .then(response => {
        expect(response.body.errors.length).toBeGreaterThan(0);
      }));

  test('Buy two albums and delete one of them', () =>
    factory
      .create('purchase')
      .then(() =>
        request(app)
          .post('/')
          .send({ query: 'mutation { removeAlbum(id:1) }', token: validToken })
      )
      .then(response => {
        expect(response.body.data.removeAlbum);
      }));
});
