const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const BadRequestError = require('../exceptions/BadRequestError');
const NotFoundError = require('../exceptions/NotFoundError');

class LikeServices {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike(userId, albumId) {
    const albumCheck = await this._pool.query({
      text: 'SELECT id FROM albums_data WHERE id = $1',
      values: [albumId],
    });

    if (!albumCheck.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const likeCheck = await this._pool.query({
      text: 'SELECT * FROM albums_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    });

    if (likeCheck.rowCount > 0) {
      throw new BadRequestError('Like hanya bisa dilakukan satu kali');
    }

    const id = `like-${nanoid(16)}`;
    await this._pool.query({
      text: 'INSERT INTO albums_likes (id, user_id, album_id) VALUES ($1, $2, $3)',
      values: [id, userId, albumId],
    });

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return {
        likes: JSON.parse(result),
        source: 'cache'
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM albums_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = parseInt(result.rows[0].count, 10);

      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(likes));

      return {
        likes,
        source: 'database'
      };
    }
  }

  async deleteLike(userId, albumId) {
    const result = await this._pool.query({
      text: 'DELETE FROM albums_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Anda tidak melakukan Like terhadap Album ini');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }
}

module.exports = LikeServices;