const request = require('request-promise'),
  typicodePath = 'https://jsonplaceholder.typicode.com',
  apiError = require('../errors');

function options(endpoint) {
  return {
    uri: endpoint,
    json: true,
    resolveWithFullResponse: false
  };
}

exports.requestAlbums = () => {
  try {
    return request(options(`${typicodePath}/albums`));
  } catch (error) {
    throw apiError(error.message);
  }
};

exports.requestAlbumPhotos = albumId => {
  try {
    return request(options(`${typicodePath}/photos?albumId=${albumId}`));
  } catch (error) {
    throw apiError(error.message);
  }
};
