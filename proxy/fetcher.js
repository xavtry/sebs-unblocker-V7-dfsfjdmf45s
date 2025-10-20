const fetch = require('node-fetch');
const { attachRequestCookies, forwardSetCookieHeaders } = require('./cookies');

async function fetchUrl(url, req, res, opts = {}) {
  const fetchOptions = { method: 'GET', redirect: 'follow', ...opts };
  attachRequestCookies(fetchOptions, req);

  const response = await fetch(url, fetchOptions);
  forwardSetCookieHeaders(res, response);

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  return { body, contentType };
}

module.exports = { fetchUrl };
