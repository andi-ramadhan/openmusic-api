const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(service, validator, songService) {
    this._service = service;
    this._validator = validator;
    this._songService = songService;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    }).code(201);
    return response;
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateSongToPlaylistPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: owner } = request.auth.credentials;

    await this._songService.verifySongExistence(songId);
    await this._service.verifyPlaylistOwner(playlistId, owner);

    const playlistSongId = await this._service.addSongToPlaylist(playlistId, { songId });

    const response = h.response({
      status: 'success',
      message: `Lagu berhasil ditambahkan ke dalam playlist ${playlistId}`,
      data: {
        playlistSongId,
      },
    }).code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: owner } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(owner);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getSongsOnPlaylistHandler(request, h){
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, owner);

    const playlistDetails = await this._service.getPlaylistById(playlistId);
    const songsOnPlaylist = await this._service.getSongsOnPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlist: {
          id: playlistDetails.id,
          name: playlistDetails.name,
          username: playlistDetails.username,
          songs: songsOnPlaylist.map((song) => ({
            id: song.id,
            title: song.title,
            performer: song.performer,
          })),
        },
      },
    };
  }

  async deletePlaylistByIdHandler(request, h){
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, owner);
    await this._service.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    };
  }

  async deleteSongOnPlaylistHandler(request, h){
    this._validator.validateSongToPlaylistPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    const { songId } = request.payload;

    await this._service.verifyPlaylistOwner(playlistId, owner);
    await this._service.deleteSongOnPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: `Lagu berhasil dihapus dari playlist ${playlistId}`,
    };
  }
}

module.exports = PlaylistHandler;