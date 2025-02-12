const autoBind = require('auto-bind');

class LikesHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async postLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._service.verifyAlbumExistence(albumId);
    await this._service.verifyLikeCheck(userId, albumId);
    await this._service.addLike(userId, albumId);

    return h.response({
      status: 'success',
      message: 'Album disukai!'
    }).code(201);
  }

  async getLikeDetailHandler(request, h) {
    const { id: albumId } = request.params;

    const { likes, source } = await this._service.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    response.header('X-Data-Source', source);
    return response;
  }

  async deleteLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._service.deleteLike(userId, albumId);

    return {
      status: 'success',
      message: 'Like berhasil dihapus',
    };
  }
}

module.exports = LikesHandler;