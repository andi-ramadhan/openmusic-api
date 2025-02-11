const UserError = require('./UserError');

class BadRequestError extends UserError {
  constructor(message) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

module.exports = BadRequestError;