const nock = require('nock');

exports.albumsListMock = (albumId, albumTitle) => {
  nock('https://jsonplaceholder.typicode.com')
    .get(`/albums/${albumId}`)
    .reply(200, {
      userId: 1,
      id: albumId,
      title: albumTitle
    });
};

exports.albumsMock = (albumId, albumTitle) => {
  nock('https://jsonplaceholder.typicode.com')
    .get('/albums')
    .reply(200, [
      {
        userId: 1,
        id: albumId,
        title: albumTitle
      }
    ]);
};

exports.albumsListMockError = albumId => {
  nock('https://jsonplaceholder.typicode.com')
    .get(`/albums/${albumId}`)
    .reply(404, {});
};
