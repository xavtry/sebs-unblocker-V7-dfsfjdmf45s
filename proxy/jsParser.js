
// lightweight JS rewriting: finds common patterns and rewrites resource references
// WARNING: editing arbitrary JS is brittle. Keep minimal.
function rewriteJsImports(jsText, baseUrl) {
  if (!jsText) return jsText;
  // rewrite import('...') and dynamic loader strings "path/to/file.js"
  return jsText.replace(/(['"])(\/?[^'"]+\.(js|json|css))\1/g, (m, q, p1) => {
    try {
      const abs = new URL(p1, baseUrl).href;
      return `"${'/resource?url=' + encodeURIComponent(abs)}"`;
    } catch (e) {
      return m;
    }
  });
}

module.exports = { rewriteJsImports };
