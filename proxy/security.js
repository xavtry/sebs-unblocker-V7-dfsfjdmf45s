
// set helpful security headers for proxy responses
module.exports = function setSecurityHeaders(res) {
  // Keep these minimal to avoid breaking proxied sites.
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // allow framing because proxied pages live in iframes sometimes; do not force DENY
  // res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Minimal CSP - avoid blocking site scripts; keep permissive but not completely open
  // We won't override CSP for proxied HTML, but for our responses:
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
};
