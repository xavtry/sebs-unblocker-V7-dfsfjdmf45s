const { validateUrl } = require('./validator');
const { fetchText } = require('./fetcher');
const { rewriteHtml } = require('./rewriter');
const { renderWithPuppeteer } = require('./puppeteer');
const cache = require('./cache');
const { logger } = require('./logger');
const config = require('./config');
const { consumeIp } = require('./throttle');

async function handleProxy(req, res, targetUrl) {
  // rate limit
  const ip = req.ip || req.connection.remoteAddress;
  const ok = await consumeIp(ip);
  if (!ok) return res.status(429).send('Too many requests');

  // validate
  const v = validateUrl(targetUrl);
  if (!v.ok) return res.status(400).send('Invalid URL: ' + v.reason);

  // caching key
  const cacheKey = 'html:' + targetUrl;
  const cached = cache.get(cacheKey);
  if (cached) {
    logger('cache hit ' + targetUrl);
    res.set('Content-Type', 'text/html; charset=utf-8');
    return res.send(cached);
  }

  // choose puppeteer for allowlist patterns or when configured
  try {
    const host = v.host.toLowerCase();
    const usePuppeteer = config.puppeteerEnabled && config.puppeteerAllowlist.some(h => host.includes(h));
    if (usePuppeteer) {
      logger('puppeteer path for ' + targetUrl);
      const html = await renderWithPuppeteer(targetUrl, config.renderTimeout);
      cache.set(cacheKey, html, config.cacheTTL);
      res.set('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    }

    // fast fetch path
    logger('fetch path for ' + targetUrl);
    const { text, contentType } = await fetchText(targetUrl, config.fetchTimeout);
    if (!text) {
      // non-text resource — redirect to /resource
      return res.redirect('/resource?url=' + encodeURIComponent(targetUrl));
    }
    // rewrite HTML
    const rewritten = rewriteHtml(text, targetUrl);
    cache.set(cacheKey, rewritten, config.cacheTTL);
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(rewritten);
  } catch (err) {
    logger('handleProxy error: ' + (err && err.message));
    // try Puppeteer fallback if enabled and not already used
    try {
      if (config.puppeteerEnabled) {
        const html = await renderWithPuppeteer(targetUrl, config.renderTimeout);
        cache.set(cacheKey, html, config.cacheTTL);
        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      }
    } catch (err2) {
      logger('puppeteer fallback failed: ' + err2.message);
      throw err2;
    }
  }
}

module.exports = { handleProxy };
