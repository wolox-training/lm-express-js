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
