const NodeCache = require('node-cache');
const { cacheTTL } = require('./config');
const cache = new NodeCache({ stdTTL: cacheTTL });
module.exports = cache;
