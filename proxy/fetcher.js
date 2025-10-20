const axios = require('axios');
const { log } = require('./logger');
const config = require('./config');

async function fetchText(url){
  const res = await axios.get(url, {
    responseType: 'text',
    timeout: config.fetch.timeout,
    headers: { 'User-Agent': config.fetch.userAgent }
  });
  return { body: res.data, contentType: res.headers['content-type'] || 'text/html' };
}

async function fetchResource(url){
  const res = await axios.get(url, { responseType: 'stream', timeout: config.fetch.timeout, headers: { 'User-Agent': config.fetch.userAgent }});
  return { stream: res.data, contentType: res.headers['content-type'] || null };
}

module.exports = { fetchText, fetchResource };
