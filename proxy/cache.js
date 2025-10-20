// simple wrapper around node-cache (already added in package.json)
const NodeCache = require('node-cache');
const config = require('./config');
const cache = new NodeCache({ stdTTL: config.cacheTTL || 60, checkperiod: 120 });
module.exports = cache;
