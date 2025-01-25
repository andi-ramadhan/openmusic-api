require('dotenv').config();

const Hapi = require('@hapi/hapi');

// Plugins
const albumPlugin = require('./api/album');
const songPlugin = require('./api/song');
const usersPlugin = require('./api/users');

// Services
const AlbumServices = require('./services/AlbumServices');
const SongServices = require('./services/SongServices');
const UserServices = require('./services/UserServices');

// Validators
const {
  AlbumValidator,
  SongValidator,
  UserValidator
} = require('./validator');

// Parent Exceptions
const UserError = require('./exceptions/UserError');

const init = async () => {
  const albumService = new AlbumServices();
  const songService = new SongServices();
  const userService = new UserServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
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
  ]);


  // Error Handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {

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