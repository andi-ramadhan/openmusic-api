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
  pgm.createTable('albums_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    }
  });

  pgm.addConstraint('albums_likes', 'unique_user_id_and_album_id', 'UNIQUE(user_id, album_id)');

  pgm.addConstraint('albums_likes', 'fk_albums_likes.user_id_users_data.id', 'FOREIGN KEY(user_id) REFERENCES users_data(id) ON DELETE CASCADE');
  pgm.addConstraint('albums_likes', 'fk_albums_likes.album_id_albums_data.id', 'FOREIGN KEY(album_id) REFERENCES albums_data(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('albums_likes');
};
