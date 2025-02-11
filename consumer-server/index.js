require('dotenv').config();
const amqp = require('amqplib');
const PlaylistService = require('./ConsumerPlaylistService');
const MailSender = require('./MailSender');
const Listener = require('./listener');
const config = require('../src/utils/config');

const init = async () => {
  console.log('RabbitMQ-AMQP Consumer started');

  const playlistService = new PlaylistService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistService, mailSender);

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();
  const channelName = 'export:playlists';

  await channel.assertQueue(channelName, {
    durable: true,
  });

  channel.consume(channelName, listener.listen, { noAck: true });
};

init();