const fetch = require('node-fetch');
const { logger } = require('./logger');

async function fetchText(url, timeout = 15000) {
  const controller = new (require('node-fetch').AbortController)();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { redirect:'follow', signal: controller.signal, headers:{ 'User-Agent':'SebUnblocker/1.0' }});
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('text') || ct.includes('html') || ct.includes('json')) {
      const txt = await res.text();
      clearTimeout(id);
      return { ok:true, text: txt, contentType: ct };
    } else {
      // non-text resource
      clearTimeout(id);
      return { ok:false, nonText:true, contentType: ct };
    }
  } catch (err) {
    clearTimeout(id);
    logger('fetcher error ' + err.message);
    throw err;
  }
}

module.exports = { fetchText };
