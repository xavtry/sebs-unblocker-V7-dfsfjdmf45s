// validates input URLs and blocks non-http(s) and private IPs
const dns = require('dns');
const net = require('net');
const { logger } = require('./logger');

function isLocalIP(host) {
  if (!host) return true;
  // quick checks for private ranges
  if (host.startsWith('127.') || host === 'localhost') return true;
  if (host.startsWith('10.') || host.startsWith('192.168.') || host.startsWith('172.')) return true;
  return false;
}

function validateUrl(input) {
  try {
    const u = new URL(input);
    if (!['http:', 'https:'].includes(u.protocol)) return { ok:false, reason: 'Unsupported protocol' };
    const host = u.hostname;
    if (isLocalIP(host)) return { ok:false, reason: 'Local/private IP not allowed' };
    return { ok:true, url: u.href, host };
  } catch (err) {
    return { ok:false, reason: 'Invalid URL' };
  }
}

module.exports = { validateUrl };
