const { AlbumsHandler } = require('./handler');
// const SongsHandler = require('./songHandler');
const { albumRoutes } = require('./routes');
// const songRoutes = require('./songRoutes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumsHandler(service, validator);
    server.route(albumRoutes(albumHandler));
  },
};

// const songsPlugin = {
//   name: 'songs',
//   version: '1.0.0',
//   register: async (server, { service }) => {
//     const songHandler = new SongsHandlerHandler(service.songService);
//     server.route(songRoutes(songHandler));
//   }
// };