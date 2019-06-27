const albums = require('./controllers/albums'),
  { healthCheck } = require('./controllers/healthCheck'),
  { signUp, signIn, listUsers, signUpAdmin, invalidateAllSessions } = require('./controllers/users'),
  usersValidations = require('../app/middlewares/validations/users'),
  { validateToken, checkNotNullToken } = require('../app/middlewares/validations/token'),
  { validateAlbumId } = require('../app/middlewares/validations/albums');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', [checkNotNullToken, validateToken], albums.getAlbums);
  app.get('/albums/:id/photos', albums.getAlbumPhotos);
  app.get('/users', [usersValidations.checkValidOffsetAndLimit, checkNotNullToken, validateToken], listUsers);
  app.get('/users/:user_id/albums', [usersValidations.checkValidUserId, validateToken], albums.listAlbums);
  app.get('/users/albums/:id/photos', [validateAlbumId, validateToken], albums.listAlbumsPhotos);
  app.post('/users', [usersValidations.checkValidName, usersValidations.checkValidEmailAndPassword], signUp);
  app.post('/users/sessions', [usersValidations.checkValidEmailAndPassword], signIn);
  app.post(
    '/admin/users',
    [usersValidations.checkValidName, usersValidations.checkValidEmailAndPassword, validateToken],
    signUpAdmin
  );
  app.post('/albums/:id', [validateAlbumId, validateToken], albums.buyAlbum);
  app.post('/users/sessions/invalidate_all', [validateToken], invalidateAllSessions);
  app.post('/users/albums/:id/remove', [validateAlbumId, validateToken], albums.removePurchase);
};
