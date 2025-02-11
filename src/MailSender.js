const nodemailer = require('nodemailer');
const config = require('./utils/config');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: config.nodemailer.host,
      port: config.nodemailer.port,
      auth: {
        user: config.nodemailer.user,
        pass: config.nodemailer.pass,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'OpenMusic API <noreply@openmusic.com',
      to: targetEmail,
      subject: 'Export Playlist',
      text: 'Here attached of the playlist export',
      attachments: [
        {
          filename: 'playlists.json',
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;