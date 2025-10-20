const { rewriteHtml } = require('./htmlParser');
module.exports = async function rewrite(html, baseUrl){
  return rewriteHtml(html, baseUrl);
};
