
// optional simple DB logger stub - can be extended to write to sqlite/postgres
// For now it appends to logs/proxy.log with structured JSON lines.

const fs = require('fs');
const LOGDB = 'logs/proxy_db.log';

function logStructured(entry) {
  try {
    const line = JSON.stringify(Object.assign({ ts: new Date().toISOString() }, entry));
    fs.appendFileSync(LOGDB, line + '\n');
  } catch (e) {
    // no-op
  }
}

module.exports = { logStructured };

