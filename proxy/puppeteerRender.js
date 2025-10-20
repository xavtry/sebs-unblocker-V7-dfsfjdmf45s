const puppeteer = require('puppeteer');
const config = require('./config');

module.exports = async function(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(config.userAgent);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: config.timeout });
  const content = await page.content();
  await browser.close();
  return content;
};
