const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { playlistService, validator, songService, collaborationService }) => {
    const playlistHandler = new PlaylistHandler(playlistService, validator, songService, collaborationService);
    server.route(routes(playlistHandler));
  },
};