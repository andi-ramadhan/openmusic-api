const ActivityHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'activities',
  version: '1.0.0',
  register: async (server, {
    activityService,
    playlistService,
    collaborationService,
    songService,
  }) => {
    const activityHandler = new ActivityHandler(
      activityService,
      playlistService,
      collaborationService,
      songService,
    );
    server.route(routes(activityHandler));
  },
};