const fetch = require('node-fetch');
const config = require('./config');
const { logger } = require('./logger');

module.exports = async function fetcher(url) {
  try {
    const res = await fetch(url, { timeout: config.timeout, headers: { 'User-Agent': config.userAgent }});
    return await res.text();
  } catch (err) {
    logger(`Fetcher error for ${url}: ${err.message}`);
    throw err;
  }
};
