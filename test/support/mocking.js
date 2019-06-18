const nock = require('nock');

exports.albumsListRequest = () => {
  nock('https://jsonplaceholder.typicode.com')
    .get('/albums')
    .reply(200);
};
