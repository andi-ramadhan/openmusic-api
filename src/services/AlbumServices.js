const { nanoid } = require('nanoid');
const { Pool } = require('pg');


class AlbumServices {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
    };
  }
}