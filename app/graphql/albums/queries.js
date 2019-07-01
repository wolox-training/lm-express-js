const { GraphQLList } = require('graphql'),
  { Album } = require('./types'),
  { requestAlbums } = require('../../services/typicode');

const getAlbumsList = () => requestAlbums().then(json => json);

exports.albums = {
  name: 'albums',
  type: new GraphQLList(Album),
  resolve: getAlbumsList
};
