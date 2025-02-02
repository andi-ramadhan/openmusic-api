const routes = (handler) => [
  {
    method: 'GET',
    path: 'playlists/{id}/activities',
    handler: handler.getPlaylistActivitiesHandler,
    options: {
      auth: 'openmusic_api_jwt'
    },
  },
];

module.exports = routes;