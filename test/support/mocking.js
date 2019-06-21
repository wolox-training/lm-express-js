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

exports.albumsPhotosListMock = albumId => {
  nock('https://jsonplaceholder.typicode.com')
    .get(`/photos?albumId=${albumId}`)
    .reply(200, [
      {
        albumId,
        id: 1,
        title: 'title1',
        url: 'url1',
        thumbnailUrl: 'thumbnailUrl1'
      },
      {
        albumId,
        id: 2,
        title: 'title2',
        url: 'url2',
        thumbnailUrl: 'thumbnailUrl2'
      }
    ]);
};

exports.albumsPhotosListMockError = albumId => {
  nock('https://jsonplaceholder.typicode.com')
    .get(`/photos?albumId=${albumId}`)
    .reply(404, []);
};
