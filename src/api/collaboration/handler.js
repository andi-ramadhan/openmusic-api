const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(service, playlistService, validator) {
    this._service = service;
    this._playlistService = playlistService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: owner } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._service.verifyUserExistence(userId);
    await this._playlistService.verifyPlaylistOwner(playlistId, owner);
    const collaborationId = await this._service.addCollaboration(playlistId, userId, owner);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    }).code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: owner } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, owner);
    await this._service.deleteCollaboration(playlistId, userId, owner);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;