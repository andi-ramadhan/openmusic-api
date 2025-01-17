const AlbumsHandler = require('./handler');
const { albumRoutes } = require('../routes');

const albumsPlugin = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumsHandler(service, validator);
    server.route(albumRoutes(albumHandler));
  },
};

module.exports = albumsPlugin;