const fs = require('fs');
const logPath = './logs/proxy.log';

function logger(msg) {
  console.log(msg);
  fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
}

module.exports = { logger };

