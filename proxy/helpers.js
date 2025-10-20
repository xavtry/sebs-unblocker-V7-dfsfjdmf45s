// small util helpers used across proxy modules

function joinUrl(base, relative) {
  try {
    return new URL(relative, base).href;
  } catch (e) {
    return relative;
  }
}

function shortHost(urlStr) {
  try { return new URL(urlStr).hostname; } catch { return urlStr; }
}

module.exports = { joinUrl, shortHost };
