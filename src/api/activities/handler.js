const autoBind = require('auto-bind');

class ActivityHandler {
  constructor(service, playlistService, collaborationService, songService) {
    this._service = service;
    this._playlistService = playlistService;
    this._collaborationService = collaborationService;
    this._songService = songService;

    autoBind(this);
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    const activities = await this._service.getPlaylistActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities
      },
    };
  }
}

module.exports = ActivityHandler;