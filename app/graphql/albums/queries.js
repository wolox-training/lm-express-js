const { GraphQLList } = require('graphql'),
  { Album } = require('./types'),
  { requestAlbums } = require('../../services/typicode'),
  logger = require('../../logger');

const getAlbumsList = () => {
  logger.info('Listing all albums');
  return requestAlbums().then(json => json);
};

exports.albums = {
  name: 'albums',
  type: new GraphQLList(Album),
  resolve: getAlbumsList
};
