const { GraphQLList } = require('graphql'),
  { Album } = require('./types'),
  { requestAlbums } = require('../../services/typicode');

const albums = () => requestAlbums().then(json => json);

exports.albums = {
  name: 'albums',
  fields: {
    albumsList: {
      type: new GraphQLList(Album),
      resolve: albums
    }
  }
};
