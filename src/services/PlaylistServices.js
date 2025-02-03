const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const AuthorizationError = require('../exceptions/AuthorizationError');
const NotFoundError = require('../exceptions/NotFoundError');


class PlaylistServices {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
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

  async addSongToPlaylist(playlistId, { songId }, userId) {
    const playlistSongId = `playlist-song-${nanoid(16)}`;
    const activityId = `activity-${nanoid(16)}`;
    const timestamp = new Date().toISOString();

    const connection = await this._pool.connect();

    try {
      const addSongResult = await connection.query({
        text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
        values: [playlistSongId, playlistId, songId],
      });

      if (!addSongResult.rowCount) {
        throw new InvariantError('Gagal menambahkan lagu ke dalam Playlist');
      }

      await connection.query({
        text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
        values: [activityId, playlistId, songId, userId, 'add', timestamp],
      });

      return addSongResult.rows[0].id;

    } catch (error) {
      if (error instanceof InvariantError) {
        throw error;
      }
      throw error;
    } finally {
      connection.release();
    }
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

  async deleteSongOnPlaylist(playlistId, songId, userId){
    const activityId = `activity-${nanoid(16)}`;
    const timestamp = new Date().toISOString();
    const connection = await this._pool.connect();

    try {
      const deleteResult = await connection.query({
        text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
        values: [playlistId, songId],
      });

      if (!deleteResult.rowCount) {
        throw new NotFoundError('Lagu gagal dihapus. Id lagu tidak ditemukan');
      }

      await connection.query({
        text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
        values: [activityId, playlistId, songId, userId, 'delete', timestamp],
      });
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
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
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      await this._collaborationService.verifyCollaborator(playlistId, userId);
    }
  }
}

module.exports = PlaylistServices;