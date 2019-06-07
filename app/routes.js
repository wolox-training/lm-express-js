// const controller = require('./controllers/controller');
const { getAlbums, getAlbumPhotos } = require('./controllers/albums'),
  { healthCheck } = require('./controllers/healthCheck'),
  { signUp, signIn, listUsers, signUpAdmin } = require('./controllers/users'),
  {
    checkValidEmailAndPassword,
    checkValidName,
    checkValidOffsetAndLimit,
    checkNotNullToken
  } = require('../app/middlewares/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.get('/users', [checkValidOffsetAndLimit, checkNotNullToken], listUsers);
  app.post('/users', [checkValidName, checkValidEmailAndPassword], signUp);
  app.post('/users/sessions', [checkValidEmailAndPassword], signIn);
  app.post('/admin/users', [checkValidName, checkValidEmailAndPassword], signUpAdmin);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
