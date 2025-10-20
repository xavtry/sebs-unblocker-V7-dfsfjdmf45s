function renderError(res, msg = 'An error occurred') {
  res.status(500).send(`
    <html>
      <head><title>Error</title></head>
      <body style="background:#010a0a;color:#ff5555;font-family:sans-serif;">
        <h1>Error</h1>
        <p>${msg}</p>
      </body>
    </html>
  `);
}

module.exports = { renderError };

