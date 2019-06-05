// const controller = require('./controllers/controller');
const { getAlbums, getAlbumPhotos } = require('./controllers/albums'),
  { healthCheck } = require('./controllers/healthCheck'),
  { signUp, signIn, listUsers } = require('./controllers/users'),
  { checkValidEmailAndPassword, checkValidName } = require('../app/middlewares/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.get('/users', listUsers);
  app.post('/users', [checkValidName, checkValidEmailAndPassword], signUp);
  app.post('/users/sessions', [checkValidEmailAndPassword], signIn);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
