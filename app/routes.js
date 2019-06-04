// const controller = require('./controllers/controller');
const { getAlbums, getAlbumPhotos } = require('./controllers/albums'),
  { healthCheck } = require('./controllers/healthCheck'),
  { signUp } = require('./controllers/users'),
  { checkValidInputs } = require('../app/middlewares/signup');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.post('/users', [checkValidInputs], signUp);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
