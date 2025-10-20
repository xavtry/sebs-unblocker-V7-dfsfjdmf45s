const { RateLimiterMemory } = require('rate-limiter-flexible');
const config = require('./config');

const rateLimiter = new RateLimiterMemory({
  points: config.rateLimitPoints,
  duration: config.rateLimitDuration
});

async function consumeIp(ip) {
  try {
    await rateLimiter.consume(ip);
    return true;
  } catch (rej) {
    return false;
  }
}

module.exports = { consumeIp };
