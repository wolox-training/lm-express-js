// const controller = require('./controllers/controller');
const { albums, photos } = require('./controllers/albums');
const { healthCheck } = require('./controllers/healthCheck');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', albums);
  app.get('/albums/:id/photos', photos);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
