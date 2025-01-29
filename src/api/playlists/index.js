const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { playlistService, validator, songService }) => {
    const playlistHandler = new PlaylistHandler(playlistService, validator, songService);
    server.route(routes(playlistHandler));
  },
};