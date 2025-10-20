const fs = require('fs');
const path = require('path');
const logfile = path.join(__dirname, '..', 'logs', 'proxy.log');

function write(line){
  const s = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFile(logfile, s, ()=>{});
  console.log(line);
}
module.exports = { log: write };
