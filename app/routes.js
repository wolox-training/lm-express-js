// const controller = require('./controllers/controller');
const { getAlbums, getAlbumPhotos } = require('./controllers/albums'),
  { healthCheck } = require('./controllers/healthCheck'),
  { signUp, signIn } = require('./controllers/users'),
  { checkValidEmailAndPassword, checkValidName } = require('../app/middlewares/signIn');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.post('/users', [checkValidName, checkValidEmailAndPassword], signUp);
  app.post('/users/sessions', [checkValidEmailAndPassword], signIn);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
