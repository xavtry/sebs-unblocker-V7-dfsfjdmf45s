const express = require('express');
const path = require('path');
const { handleProxy } = require('./proxy/proxyMiddleware');
const searchAPI = require('./proxy/searchAPI');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// health
app.get('/_health', (req,res)=>res.send('ok'));

// main proxy endpoint: /proxy?url=
app.get('/proxy', handleProxy);

// resource fetch (images/css/js) - proxies raw resources
app.get('/resource', async (req,res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('missing url');
  try {
    const { stream, contentType } = await require('./proxy/fetcher').fetchResource(url);
    if (contentType) res.setHeader('content-type', contentType);
    stream.pipe(res);
  } catch (e) {
    console.error('resource error', e);
    res.status(502).send('Resource fetch error');
  }
});

// search endpoint
app.get('/search', async (req,res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json([]);
  try {
    const results = await searchAPI(q);
    res.json(results);
  } catch (e) {
    console.error('search error', e);
    res.status(500).json([]);
  }
});

// fallback to index (keeps SPA working)
app.get('*', (req,res)=> {
  res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(PORT, ()=>console.log(`Server listening ${PORT}`));
