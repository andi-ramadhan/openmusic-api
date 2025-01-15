const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async postAlbumHandler(request, h){
    const { name, year } = request.payload;

    this._service.addAlbum({ name, year });
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
    const { id } = request.params;
    await this._service.editAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request, h){
    const { id } = request.params;
    await this.service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;