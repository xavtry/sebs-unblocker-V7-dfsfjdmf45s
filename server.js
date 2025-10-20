const express = require('express');
const path = require('path');
const fetcher = require('./proxy/fetcher');
const rewrite = require('./proxy/rewrite');
const puppeteerRender = require('./proxy/puppeteerRender');
const searchAPI = require('./proxy/searchAPI');
const proxyMiddleware = require('./proxy/proxyMiddleware');
const { logger } = require('./proxy/logger');
const config = require('./proxy/config');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Proxy route
app.get('/proxy', proxyMiddleware, async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('No URL specified');

  try {
    let content;
    if (config.usePuppeteer) {
      content = await puppeteerRender(targetUrl);
    } else {
      content = await fetcher(targetUrl);
    }
    const rewritten = await rewrite(content, targetUrl);
    res.send(rewritten);
  } catch (err) {
    logger(`Error fetching ${targetUrl}: ${err.message}`);
    res.status(500).sendFile(path.join(__dirname, 'views', 'error.html'));
  }
});

// Search route
app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).send('No query provided');

  try {
    const results = await searchAPI(query);
    res.json(results);
  } catch (err) {
    logger(`Search error: ${err.message}`);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
