const { Pool } = require('pg');

class AlbumCoverService {
  constructor(storageService) {
    this._pool = new Pool();
    this._storageService = storageService;
  }

  async addCoverAlbum(file, meta, albumId) {
    const filename = await this._storageService.writeFile(file, meta, albumId);

    const query = {
      text: 'UPDATE albums_data SET cover = $1 WHERE id = $2 RETURNING id',
      values: [filename, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return filename;
  }
}

module.exports = AlbumCoverService;