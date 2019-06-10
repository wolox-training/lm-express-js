// const controller = require('./controllers/controller');
const { getAlbums, getAlbumPhotos } = require('./controllers/albums'),
  { healthCheck } = require('./controllers/healthCheck'),
  { signUp, signIn, listUsers, signUpAdmin } = require('./controllers/users'),
  usersValidations = require('../app/middlewares/validations/users'),
  { validateToken } = require('../app/middlewares/validations/token');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.get(
    '/users',
    [usersValidations.checkValidOffsetAndLimit, usersValidations.checkNotNullToken, validateToken],
    listUsers
  );
  app.post('/users', [usersValidations.checkValidName, usersValidations.checkValidEmailAndPassword], signUp);
  app.post('/users/sessions', [usersValidations.checkValidEmailAndPassword], signIn);
  app.post(
    '/admin/users',
    [usersValidations.checkValidName, usersValidations.checkValidEmailAndPassword],
    signUpAdmin
  );
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
