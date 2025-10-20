
// small helpers for iframe interactions (postMessage pass-through)
// Minimal for now; can be expanded
window.addEventListener('message', (ev) => {
  // For security, you could inspect ev.origin and ev.data
  // Currently just log
  console.log('iframe message', ev.origin, ev.data);
});
