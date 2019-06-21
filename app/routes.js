const { getAlbums, getAlbumPhotos, buyAlbum, listAlbums, listAlbumsPhotos } = require('./controllers/albums'),
  { healthCheck } = require('./controllers/healthCheck'),
  { signUp, signIn, listUsers, signUpAdmin, invalidateAllSessions } = require('./controllers/users'),
  usersValidations = require('../app/middlewares/validations/users'),
  { validateToken, checkNotNullToken } = require('../app/middlewares/validations/token'),
  { validateAlbumId } = require('../app/middlewares/validations/albums');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.get('/users', [usersValidations.checkValidOffsetAndLimit, checkNotNullToken, validateToken], listUsers);
  app.get('/users/:user_id/albums', [usersValidations.checkValidUserId, validateToken], listAlbums);
  app.get('/users/albums/:id/photos', [validateAlbumId, validateToken], listAlbumsPhotos);
  app.post('/users', [usersValidations.checkValidName, usersValidations.checkValidEmailAndPassword], signUp);
  app.post('/users/sessions', [usersValidations.checkValidEmailAndPassword], signIn);
  app.post(
    '/admin/users',
    [usersValidations.checkValidName, usersValidations.checkValidEmailAndPassword, validateToken],
    signUpAdmin
  );
  app.post('/albums/:id', [validateAlbumId, validateToken], buyAlbum);
  app.post('/users/sessions/invalidate_all', [validateToken], invalidateAllSessions);
};
