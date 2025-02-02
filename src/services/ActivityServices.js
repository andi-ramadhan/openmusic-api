const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class ActivityServices {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT playlist_song_activities.username, playlist_song_activities.title, playlist_song_activities.action, playlist_song_activities.time
      FROM playlist_song_activities
      LEFT JOIN playlists ON playlists.id = playlist_song_activities.id
      WHERE playlist_song_activities.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ActivityServices;