const fs = require('fs');
const paths = ['logs','proxy','public/js','public/css','views'];
paths.forEach(p => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); });
const log = 'logs/proxy.log';
if (!fs.existsSync(log)) fs.writeFileSync(log, '');
console.log('Setup done.');
