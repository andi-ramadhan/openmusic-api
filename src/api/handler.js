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
  }

  async getAlbumByIdHandler(request, h){

  }

  async putAlbumByIdHandler(request, h){

  }

  async deleteAlbumByIdHandler(request, h){

  }
}