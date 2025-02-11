const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(userId) {
    const query = {
      text: `SELECT p.id, p.name,
      COALESCE(json_agg(
        json_build_object(
          'id', s.id,
          'title', s.title,
          'performer', s.performer
          )
        ) FILTER (WHERE s.id IS NOT NULL), '[]') as songs
      FROM playlists p
      LEFT JOIN playlist_songs ps ON ps.playlist_id = p.id
      LEFT JOIN songs_data s ON s.id = ps.song_id
      WHERE p.owner = $1
      GROUP BY p.id, p.name`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return {
        playlist: {
          id: null,
          name: null,
          songs: []
        }
      };
    }

    return {
      playlist: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        songs: result.rows[0].songs || []
      }
    };
  }
}

module.exports = PlaylistService;