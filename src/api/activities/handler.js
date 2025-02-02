const autoBind = require('auto-bind');

class ActivityHandler {
  constructor(service, collaborationService, playlistService, songService) {
    this._service = service;
    this._collaborationService = collaborationService;
    this._playlistService = playlistService;
    this._songService = songService;

    autoBind(this);
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    const playlistDetails = await this._playlistService.getPlaylistById(playlistId);
    const activities = await this._service.getPlaylistActivities(playlistId);
    const songs = await this._songService.getSongsOnPlaylist(playlistId);
    const songTitle = songs.map((song) => ({ song.title }));

    return {
      status: 'success',
      data: {
        playlistId: playlistDetails.id,
        activities: {
          username: playlistDetails.username,
          title: song.title,
          action: activities.action,
          time: activities.time,
        },
      },
    };
  }
}