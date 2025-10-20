const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = async function rewrite(html, baseUrl) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Rewrite href/src
  [...document.querySelectorAll('[href],[src]')].forEach(el => {
    const attr = el.href ? 'href' : 'src';
    try {
      el[attr] = `/proxy?url=${encodeURIComponent(new URL(el[attr], baseUrl))}`;
    } catch {}
  });

  // Remove <base>
  [...document.querySelectorAll('base')].forEach(b => b.remove());

  return dom.serialize();
};
