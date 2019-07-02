const { GraphQLList } = require('graphql'),
  { Album } = require('./types'),
  { requestAlbums } = require('../../services/typicode'),
  logger = require('../../logger');

const albums = () => {
  logger.info('Listing all albums');
  return requestAlbums().then(json => json);
};

exports.albums = {
  name: 'albums',
  fields: {
    albumsList: {
      type: new GraphQLList(Album),
      resolve: albums
    }
  }
};
