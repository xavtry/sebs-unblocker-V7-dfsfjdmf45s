// basic cookie forwarding helpers
// This does not implement full cookie jar behavior.
// It simply forwards incoming cookies from client to origin fetches (where applicable)
// and copies Set-Cookie headers from origin back to client responses when proxied via /resource.

function attachRequestCookies(fetchOptions, req) {
  if (!fetchOptions.headers) fetchOptions.headers = {};
  if (req.headers.cookie) {
    fetchOptions.headers['cookie'] = req.headers.cookie;
  }
}

function forwardSetCookieHeaders(res, originResponse) {
  const setCookie = originResponse.headers && originResponse.headers.raw && originResponse.headers.raw()['set-cookie'];
  if (setCookie && setCookie.length) {
    // forward as-is; Express will handle multiple headers.
    res.setHeader('Set-Cookie', setCookie);
  }
}

module.exports = { attachRequestCookies, forwardSetCookieHeaders };
