const redis = require('redis');
const config = require('../../utils/config');
const NotFoundError = require('../../exceptions/NotFoundError');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.server,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  async set(keys, value, expirationInSecond = 1800) {
    await this._client.set(keys, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new NotFoundError('Cache tidak ditemukan');

    return result;
  }

  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;