const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const AuthorizationError = require('../exceptions/AuthorizationError');
const NotFoundError = require('../exceptions/NotFoundError');

class CollaborationServices {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations_data VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations_data WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations_data WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Akses ditolak');
    }
  }

  async verifyUserExistence(userId) {
    const query = {
      text: 'SELECT id FROM users_data WHERE id = $1',
      values: [userId],
    };

    const userResult = await this._pool.query(query);

    if (!userResult.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }
}

module.exports = CollaborationServices;