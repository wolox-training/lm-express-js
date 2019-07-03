const request = require('request-promise'),
  { apiError } = require('../errors'),
  logger = require('../logger'),
  typicodePath = 'https://jsonplaceholder.typicode.com';

const options = endpoint => ({
  uri: endpoint,
  json: true,
  resolveWithFullResponse: false
});

exports.requestAlbums = () => {
  logger.info('Requesting albums to jsonplaceholder API');
  return request(options(`${typicodePath}/albums`)).catch(error => {
    throw apiError(error.message);
  });
};

exports.requestAlbumPhotos = albumId => {
  logger.info(`Requesting album -with id ${albumId}- photos to jsonplaceholder API`);
  return request(options(`${typicodePath}/photos?albumId=${albumId}`)).catch(error => {
    throw apiError(error.message);
  });
};

exports.getAlbumById = albumId => {
  logger.info(`Requesting album with id ${albumId}`);
  return request(options(`${typicodePath}/albums/${albumId}`)).catch(error => {
    throw apiError(error.message);
  });
};

exports.createNewAlbum = (albumTitle, albumBody) => {
  logger.info(`Creating new album with title: ${albumTitle}`);
  const creatingOptions = {
    method: 'POST',
    body: JSON.stringify({
      title: albumTitle,
      body: albumBody
    }),
    uri: 'https://jsonplaceholder.typicode.com/posts',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  };
  return request(creatingOptions)
    .then(response => JSON.parse(response))
    .catch(error => {
      throw apiError(error.message);
    });
};
