const { Pool } = require('pg');

class ActivityServices {
  constructor(collaborationService) {
    this._pool = new Pool();
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT users_data.username, songs_data.title,
      playlist_song_activities.action, playlist_song_activities.time
      FROM playlist_song_activities
      LEFT JOIN users_data ON users_data.id = playlist_song_activities.user_id
      LEFT JOIN songs_data ON songs_data.id = playlist_song_activities.song_id
      WHERE playlist_song_activities.playlist_id = $1
      ORDER BY playlist_song_activities.time ASC`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ActivityServices;