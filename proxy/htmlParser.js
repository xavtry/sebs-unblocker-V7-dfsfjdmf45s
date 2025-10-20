const cheerio = require('cheerio');
const { URL } = require('url');
const { log } = require('./logger');

function makeProxyUrl(abs){
  return `/proxy?url=${encodeURIComponent(abs)}`;
}
function makeResourceUrl(abs){
  return `/resource?url=${encodeURIComponent(abs)}`;
}

function rewriteHtml(html, baseUrl){
  const $ = cheerio.load(html, { decodeEntities: false });

  // insert base to help client resolution (but we will still rewrite explicit attrs)
  try {
    const u = new URL(baseUrl);
    if ($('base').length === 0) $('head').prepend(`<base href="${u.origin}/">`);
  } catch(e){}

  // attributes to rewrite: href, src, data-src, srcset, action
  const rewriteAttr = (i, el) => {
    const attribs = ['href','src','data-src','action'];
    for (const attr of attribs){
      const val = $(el).attr(attr);
      if (!val) continue;
      if (/^\s*javascript:/i.test(val) || /^\s*mailto:/i.test(val) || val.startsWith('#')) continue;
      try {
        const abs = new URL(val, baseUrl).href;
        // asset ext check
        const ext = abs.split('?')[0].split('#')[0].split('.').pop().toLowerCase();
        const assetExts = ['css','js','png','jpg','jpeg','gif','svg','webp','woff','woff2','ttf','otf','map','ico','json','mp4','webm'];
        if (assetExts.includes(ext)) $(el).attr(attr, makeResourceUrl(abs));
        else $(el).attr(attr, makeProxyUrl(abs));
      } catch(err){}
    }
    // srcset (multiple URLs)
    if ($(el).attr('srcset')){
      const srcset = $(el).attr('srcset').split(',').map(s => s.trim().split(' ')[0]);
      const rewritten = srcset.map(s => {
        try { return makeResourceUrl(new URL(s, baseUrl).href); } catch { return s; }
      }).join(', ');
      $(el).attr('srcset', rewritten);
    }
  };

  $('[href],[src],[data-src],[action],[srcset]').each(rewriteAttr);

  // rewrite inline styles with url(...)
  $('style, link[rel="stylesheet"]').each((i, el) => {
    if (el.name === 'style'){
      const text = $(el).html();
      $(el).html(rewriteCssUrls(text, baseUrl));
    } else if (el.name === 'link' && $(el).attr('href')){
      // link href already rewritten above
    }
  });

  // small client-side patch: override window.open to route through proxy for absolute links
  $('body').append(`<script>
    (function(){
      const orig = window.open;
      window.open = function(url){ try { location.href='/proxy?url='+encodeURIComponent(url); } catch(e){ return orig.apply(this, arguments); }};
    })();
  </script>`);

  return $.html();
}

function rewriteCssUrls(cssText, baseUrl){
  return cssText.replace(/url\(([^)]+)\)/gi, (m, inner) => {
    let cleaned = inner.replace(/['"]/g,'').trim();
    try {
      const abs = new URL(cleaned, baseUrl).href;
      return `url("/resource?url=${encodeURIComponent(abs)}")`;
    } catch { return m; }
  });
}

module.exports = { rewriteHtml, rewriteCssUrls };

