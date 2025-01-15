require('dotenv').config();

const Hapi = require('@hapi/hapi');
const openmusicPlugins = require('./api/album');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  for (const plugin of openmusicPlugins) {
    await server.register({
      plugin,
      options: {
        service: {
          albumService: {},
          songService: {},
        }
      },
    });
  }

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();