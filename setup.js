
const fs = require('fs');
const path = require('path');

const dirs = ['logs', 'public/css', 'public/js', 'public/fonts'];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('Setup complete: folders created.');
