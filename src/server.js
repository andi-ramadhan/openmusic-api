require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Plugins
const albumPlugin = require('./api/album');
const songPlugin = require('./api/song');
const usersPlugin = require('./api/users');
const authPlugin = require('./api/auth');
const playlistPlugin = require('./api/playlists');
const collaborationPlugin = require('./api/collaboration');

// Services
const AlbumServices = require('./services/AlbumServices');
const SongServices = require('./services/SongServices');
const UserServices = require('./services/UserServices');
const PlaylistServices = require('./services/PlaylistServices');
const CollaborationServices = require('./services/CollaborationServices');
const AuthenticationsService = require('./services/AuthServices');
const TokenManager = require('./tokenize/TokenManager');

// Validators
const {
  AlbumValidator,
  SongValidator,
  UserValidator,
  PlaylistValidator,
} = require('./validator');
const CollaborationsValidator = require('./validator/collab');
const AuthenticationsValidator = require('./validator/auth');

// Parent Exceptions
const UserError = require('./exceptions/UserError');

const init = async () => {
  const albumService = new AlbumServices();
  const songService = new SongServices();
  const userService = new UserServices();
  const authService = new AuthenticationsService();
  const playlistService = new PlaylistServices();
  const collaborationService = new CollaborationServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register external plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // define jwt authentication strategy
  server.auth.strategy('openmusic_api_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albumPlugin,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songPlugin,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
    {
      plugin: authPlugin,
      options: {
        authService, userService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlistPlugin,
      options: {
        playlistService,
        songService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborationPlugin,
      options: {
        collaborationService,
        playlistService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  // Error Handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      console.error('Error response:', response);

      // Internal Error Handling
      if (response instanceof UserError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // Hapi Native Error Handling
      if (!response.isServer) {
        return h.continue;
      }

      // Internal Server Custom Error
      const newResponse = h.response({
        status: 'error',
        message: 'Sorry but an error occurred on our server'
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();