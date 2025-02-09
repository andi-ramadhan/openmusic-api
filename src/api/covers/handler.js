const autoBind = require('auto-bind');
const config = require('../../utils/config');

class CoverHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postCoverHandler(request, h) {
    const { cover, id } = request.payload;
    this._validator.validateCoverHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);

    return h.response({
      status: 'success',
      data: {
        fileLocation: `http://${config.app.host}:${config.app.port}/albums/${id}/covers/${filename}`,
      }
    }).code(201);
  }
}

module.exports = CoverHandler;