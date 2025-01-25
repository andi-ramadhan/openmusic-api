const UserError = require('./UserError');

class AuthenticationError extends UserError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;