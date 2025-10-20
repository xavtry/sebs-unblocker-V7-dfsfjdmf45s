const cheerio = require('cheerio');
const { logger } = require('./logger');

// helper to absolute-ify and rewrite attr to proxy routes
function proxifyAttr(attrVal, baseUrl) {
  try {
    const abs = new URL(attrVal, baseUrl).href;
    return `/proxy?url=${encodeURIComponent(abs)}`;
  } catch { return attrVal; }
}

function rewriteHtml(html, baseUrl) {
  const $ = cheerio.load(html, { decodeEntities: false });

  // remove base tags
  $('base').remove();

  // rewrite common attributes
  $('[href]').each((i, el) => {
    const v = $(el).attr('href');
    if (!v) return;
    if (/^\s*javascript:/i.test(v) || v.startsWith('#') || v.startsWith('mailto:')) return;
    $(el).attr('href', proxifyAttr(v, baseUrl));
  });

  $('[src]').each((i, el) => {
    const v = $(el).attr('src');
    if (!v) return;
    if (/^\s*data:/.test(v)) return; // keep data URIs
    $(el).attr('src', proxifyAttr(v, baseUrl));
  });

  // srcset rewrite (images with responsive sources)
  $('[srcset]').each((i, el) => {
    const v = $(el).attr('srcset');
    if (!v) return;
    const parts = v.split(',').map(p => {
      const [urlPart, descriptor] = p.trim().split(/\s+/, 2);
      const prox = proxifyAttr(urlPart, baseUrl);
      return descriptor ? `${prox} ${descriptor}` : prox;
    });
    $(el).attr('srcset', parts.join(', '));
  });

  // rewrite forms
  $('form[action]').each((i, el) => {
    const v = $(el).attr('action');
    if (!v) return;
    $(el).attr('action', proxifyAttr(v, baseUrl));
  });

  // rewrite iframe src
  $('iframe[src]').each((i, el) => {
    const v = $(el).attr('src');
    if (!v) return;
    $(el).attr('src', proxifyAttr(v, baseUrl));
  });

  // rewrite CSS in <style> blocks: url(...)
  $('style').each((i, el) => {
    const css = $(el).html();
    if (!css) return;
    const newCss = css.replace(/url\(([^)]+)\)/g, (m, p1) => {
      const stripped = p1.replace(/['"]/g, '').trim();
      try { const abs = new URL(stripped, baseUrl).href; return `url("/resource?url=${encodeURIComponent(abs)}")`; } catch { return m; }
    });
    $(el).html(newCss);
  });

  // rewrite inline styles with url(...) (style attribute)
  $('[style]').each((i, el) => {
    let s = $(el).attr('style');
    if (!s) return;
    s = s.replace(/url\(([^)]+)\)/g, (m, p1) => {
      const stripped = p1.replace(/['"]/g, '').trim();
      try { const abs = new URL(stripped, baseUrl).href; return `url("/resource?url=${encodeURIComponent(abs)}")`; } catch { return m; }
    });
    $(el).attr('style', s);
  });

  // inject small script to capture window.open and navigation and use proxy
  $('body').append(`<script>
    (function(){
      const _open = window.open;
      window.open = function(u,n){ try { const abs = new URL(u, location.href); location.href = '/proxy?url=' + encodeURIComponent(abs.href); return null; } catch(e){ return _open.apply(this, arguments);} };
      // intercept links clicked that would navigate top-level to external domains (some sites rely on target=_top)
      document.addEventListener('click', function(e){
        let a = e.target;
        while(a && a.tagName !== 'A') a = a.parentElement;
        if(a && a.tagName === 'A' && a.href){
          const href = a.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
            e.preventDefault();
            location.href = '/proxy?url=' + encodeURIComponent(new URL(href, location.href).href);
          }
        }
      }, true);
    })();
  </script>`);

  return $.html();
}

module.exports = { rewriteHtml };
