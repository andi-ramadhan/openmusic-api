const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistHandler,
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistHandler,
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongToPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongsOnPlaylistHandler,
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongOnPlaylistHandler,
  },
];

module.exports = routes;