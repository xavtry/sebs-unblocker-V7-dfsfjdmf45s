const { URL } = require('url');

function isPrivateHost(hostname){
  // blunt check: block localhost and private ranges by name
  if (!hostname) return true;
  const low = hostname.toLowerCase();
  if (low === 'localhost' || low === '127.0.0.1') return true;
  // could add IP range checks; keep simple for now
  return false;
}

function validateUrl(u){
  try {
    const url = new URL(u);
    if (!/^https?:$/i.test(url.protocol)) return false;
    if (isPrivateHost(url.hostname)) return false;
    return true;
  } catch { return false; }
}
module.exports = { validateUrl };
