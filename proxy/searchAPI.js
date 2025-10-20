const fetch = require('node-fetch');
const { logger } = require('./logger');

async function searchHandler(req, res) {
  const q = req.query.q;
  if (!q) return res.status(400).send('No query');
  try {
    const response = await fetch('https://duckduckgo.com/html/?q=' + encodeURIComponent(q));
    const html = await response.text();
    // simple parse for result links & snippets (brittle but works often)
    const results = [];
    const regex = /<a rel="nofollow" class="result__a" href="([^"]+)"[^>]*>([^<]+)<\/a>.*?<a class="result__snippet">([^<]+)<\/a>/gs;
    let m;
    while ((m = regex.exec(html)) && results.length < 10) {
      results.push({ title: m[2], url: m[1], description: m[3] });
    }
    res.json(results);
  } catch (err) {
    logger('search error: ' + err.message);
    res.status(500).json([]);
  }
}

module.exports = { searchHandler };
