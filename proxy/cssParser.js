
// more robust CSS url(...) rewriting helper used by rewriter
function rewriteCssUrls(cssText, baseUrl) {
  if (!cssText) return cssText;
  return cssText.replace(/url\(([^)]+)\)/g, (match, p1) => {
    const raw = p1.replace(/['"]/g, '').trim();
    try {
      const abs = new URL(raw, baseUrl).href;
      return `url("/resource?url=${encodeURIComponent(abs)}")`;
    } catch (e) {
      return match;
    }
  });
}

module.exports = { rewriteCssUrls };
