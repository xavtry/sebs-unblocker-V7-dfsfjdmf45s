// basic sanitize helpers for HTML strings used by the proxy
// NOTE: this is conservative — heavy sanitization can break proxied pages.
module.exports = {
  removeBaseTags(html) {
    return html.replace(/<base[^>]*>/gi, '');
  },

  stripMetaCSP(html) {
    // remove meta content-security-policy tags that will block our injected script rewrites
    return html.replace(/<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '');
  },

  sanitizeInlineScripts(html) {
    // optional: disable inline scripts that immediately redirect the top window
    // but we will not perform aggressive removal by default.
    return html;
  }
};

