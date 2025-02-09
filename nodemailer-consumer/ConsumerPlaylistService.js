const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    const query = {
      text: `SELECT songs_data.id, songs_data.title, songs_data.performer
      FROM songs_data
      LEFT JOIN playlist_songs ON playlist_songs.song_id = songs_data.id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistService;