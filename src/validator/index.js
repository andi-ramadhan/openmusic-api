const InvariantError = require('../exceptions/InvariantError');
const {
  AlbumPayloadSchema,
  SongPayloadSchema,
  UserPayloadSchema,
  PlaylistPayloadSchema,
  SongToPlaylistPayloadSchema
} = require('./schema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

const SongValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

const UserValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongToPlaylistPayload: (payload) => {
    const validationResult = SongToPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = {
  AlbumValidator,
  SongValidator,
  UserValidator,
  PlaylistValidator
};