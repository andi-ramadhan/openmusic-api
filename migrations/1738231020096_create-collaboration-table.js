/* eslint-disable camelcase */
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('collaborations_data', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('collaborations_data', 'unique_nonPrimaryKey_value', 'UNIQUE(playlist_id, user_id)');

  pgm.addConstraint('collaborations_data', 'fk_collaborations_data.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations_data', 'fk_collaborations_data.user_id_users_data.id', 'FOREIGN KEY(user_id) REFERENCES users_data(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('collaborations_data', 'unique_nonPrimaryKey_value');
  pgm.dropConstraint('collaborations_data', 'fk_collaborations_data.playlist_id_playlists.id');
  pgm.dropConstraint('collaborations_data', 'fk_collaborations_data.user_id_users_data.id');

  pgm.dropTable('collaborations_data');
};
