const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const AuthorizationError = require('../exceptions/AuthorizationError');
const NotFoundError = require('../exceptions/NotFoundError');


class PlaylistServices {
  constructor(service) {
    this._pool = new Pool();
    this._service = service;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async addSongToPlaylist(playlistId, { songId }) {
    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan dalam Playlist');
    }

    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users_data.username 
      FROM playlists
      LEFT JOIN users_data ON users_data.id = playlists.owner
      LEFT JOIN collaborations_data ON collaborations_data.playlist_id = playlists.id
      WHERE playlists.owner = $1 OR collaborations_data.user_id = $1
      GROUP BY playlists.id, users_data.username`,
      values: [userId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongsOnPlaylist(playlistId) {
    const query = {
      text: `SELECT songs_data.id, songs_data.title, songs_data.performer
      FROM songs_data
      LEFT JOIN playlist_songs ON playlist_songs.song_id = songs_data.id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan atau tidak ada lagu di dalamnya');
    }

    return result.rows;
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users_data.username
      FROM playlists
      LEFT JOIN users_data ON users_data.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async deletePlaylistById(playlistId){
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id playlist tidak ditemukan');
    }
  }

  async deleteSongOnPlaylist(playlistId, songId){
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id lagu tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Akses ditolak');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    // debug
    console.log(`Verifying access for playlistId: ${playlistId}, userId: ${userId}`);

    const query = {
      text: `SELECT playlists.id, playlists.owner, collaborations_data.user_id FROM playlists
      LEFT JOIN collaborations_data ON collaborations_data.playlist_id = playlists.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    console.log(`Query: ${query.text}`);
    console.log(`Values: ${query.values}`);
    console.log(`Result: ${JSON.stringify(result.rows)}`);

    if (!result.rowCount) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== userId && !result.rows.some((row) => row.user_id === userId)) {
      throw new AuthorizationError('Akses ditolak');
    }
  }
}

module.exports = PlaylistServices;