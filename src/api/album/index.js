const AlbumsHandler = require('./albumHandler');
const SongsHandler = require('./songHandler');
const albumRoutes = require('./albumRoutes');
const songRoutes = require('./songRoutes');

const albumsPlugin = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service }) => {
    const albumHandler = new AlbumsHandler(service.albumService);
    server.route(albumRoutes(albumHandler));
  }
};

const songsPlugin = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service }) => {
    const songHandler = new SongsHandlerHandler(service.songService);
    server.route(songRoutes(songHandler));
  }
};

module.exports = [albumsPlugin, songsPlugin];