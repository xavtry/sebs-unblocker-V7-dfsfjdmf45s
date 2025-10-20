const puppeteer = require('puppeteer');
const { rewriteHtml } = require('./rewriter');
const { logger } = require('./logger');
const { puppeteerEnabled } = require('./config') || {};
let browserPromise = null;

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'], headless: true });
  }
  return browserPromise;
}

async function renderWithPuppeteer(url, timeout = 30000) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.setUserAgent('SebUnblocker/1.0');
  await page.setViewport({ width: 1200, height: 900 });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout });
    await page.waitForTimeout(300); // small extra wait
    const content = await page.content();
    // rewrite links to proxy
    const rewritten = rewriteHtml(content, url);
    await page.close();
    return rewritten;
  } catch (err) {
    await page.close();
    logger('puppeteer render error: ' + err.message);
    throw err;
  }
}

module.exports = { renderWithPuppeteer };
