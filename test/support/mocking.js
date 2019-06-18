const nock = require('nock');

exports.albumsListMock = id => {
  nock('https://jsonplaceholder.typicode.com')
    .get(`/albums/${id}`)
    .reply(200, {
      userId: 1,
      id,
      title: 'quidem molestiae enim'
    });
};
