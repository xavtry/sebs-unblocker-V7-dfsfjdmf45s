function safeUrl(u){
  try { return new URL(u).href; } catch { return null; }
}
function sameOrigin(a,b){ try { return new URL(a).origin === new URL(b).origin; } catch { return false; } }
module.exports = { safeUrl, sameOrigin };
