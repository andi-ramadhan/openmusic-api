const UserError = require('./UserError');

class AuthorizationError extends UserError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;