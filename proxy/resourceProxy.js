const fetch = require('node-fetch');
const mime = require('mime');
const { logger } = require('./logger');
const { validateUrl } = require('./validator');

async function resourceHandler(req, res) {
  const target = req.query.url;
  if (!target) return res.status(400).send('Missing url');

  const v = validateUrl(target);
  if (!v.ok) return res.status(400).send('Invalid target: ' + v.reason);

  try {
    const remote = await fetch(target, { redirect:'follow', timeout: 15000 });
    const buffer = await remote.buffer();
    const contentType = remote.headers.get('content-type') || mime.getType(target) || 'application/octet-stream';
    res.set('Content-Type', contentType);
    res.send(buffer);
  } catch (err) {
    logger('resourceProxy error for ' + target + ' - ' + err.message);
    res.status(502).send('Resource fetch error');
  }
}

module.exports = { resourceHandler };
