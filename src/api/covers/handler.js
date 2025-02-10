const autoBind = require('auto-bind');

class CoverHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postCoverHandler(request, h) {
    const { id: albumId } = request.params;
    const { cover } = request.payload;

    this._validator.validateCoverHeaders(cover.hapi.headers);

    await this._service.writeFile(cover, cover.hapi, albumId);

    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }
}

module.exports = CoverHandler;