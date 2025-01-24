const SongsHandler = require('./handler');
const songRoutes = require('./routes');

const songsPlugin = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songHandler = new SongsHandler(service, validator);
    server.route(songRoutes(songHandler));
  }
};

module.exports = songsPlugin;