const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h){
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h){
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request, h){
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request, h){
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h){
    this._validator.validateSongPayload(request.payload);
    const { title, year, performer, genre, duration = null, albumId = null } = request.payload;

    const songId = await this._service.addSong({ title, year, performer, genre, duration, albumId });

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(){
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      }
    };
  }

  async getSongByIdHandler(request, h){
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request, h){
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const { title, year, performer, genre, duration = null, albumId = null } = request.payload;

    await this._service.editSongById(id, { title, year, performer, genre, duration, albumId });

    return {
      status: 'success',
      message: 'Data Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request, h){
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Data Lagu berhasil dihapus',
    };
  }
}

module.exports = { AlbumsHandler, SongsHandler };