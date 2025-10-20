module.exports = {
  puppeteer: {
    enabled: true,
    launchOptions: {
      headless: true,
      args: ['--no-sandbox','--disable-setuid-sandbox']
    },
    waitUntil: 'networkidle2',
    timeout: 30000
  },
  fetch: {
    timeout: 15000,
    userAgent: 'SebUnblocker/1.0 (+https://example.com)'
  },
  cacheTTLms: 60 * 1000, // simple in-memory TTL for rendered pages/resources
  maxBodySize: 12 * 1024 * 1024 // 12MB
};
