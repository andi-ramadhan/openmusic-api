const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(service, validator, tokenManager) {
    this._service = service;
    this._validator = validator;
    this._tokenManager = tokenManager;

    autoBind(this);
  }

  async postPlaylistHandler(request, h){
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: owner } = this._tokenManager.verifyAccessToken(request.headers.authorization);
  }
}