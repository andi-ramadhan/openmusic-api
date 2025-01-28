const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string()
});

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const SongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});


module.exports = {
  AlbumPayloadSchema,
  SongPayloadSchema,
  UserPayloadSchema,
  PlaylistPayloadSchema,
  SongToPlaylistPayloadSchema };