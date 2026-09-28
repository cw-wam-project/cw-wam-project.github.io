const asset = path => `${path}?v=20260928-paper1`;
const labels = {comparison:'Comparison', single:'Robot Execution', more:'Task completion'};
const methodLabels = {wam:'WAM', wam_wrench:'WAM + Wrench', cw_wam:'CW-WAM', cw_wam_admittance:'CW-WAM + Adm.'};
const slugs = {wam:'wam', wam_wrench:'wam-wrench', cw_wam:'cw-wam', cw_wam_admittance:'cw-wam-admittance'};
const extras = {peg:'peg-examples', adapter:'adapter-repeated', wiping:'ink-removal'};

document.querySelectorAll('[data-task-panel]').forEach(panel => {
  const task = panel.dataset.taskPanel;
  const title = panel.querySelector('h3').textContent;
  const player = panel.querySelector('video');
  const controls = panel.querySelector('.method-controls');
  let view = 'comparison', method = 'cw_wam', repeatMethod = 'cw_wam';
  function loadVideo() {
    const single = view === 'single';
    const repeated = view === 'more' && task === 'transport';
    const activeMethod = repeated ? repeatMethod : method;
    let file = task, poster = task;
    if (single) {
      file += '-' + slugs[method];
      poster += method === 'cw_wam' ? '-single' : '-' + slugs[method];
    } else if (repeated) {
      file = poster = `transport-repeated-${slugs[repeatMethod]}`;
    } else if (view === 'more') file = poster = extras[task];
    player.pause();
    player.poster = asset(`assets/images/${poster}-poster.jpg`);
    player.querySelector('source').src = asset(`assets/videos/${file}.mp4`);
    player.querySelector('a').href = asset(`assets/videos/${file}.mp4`);
    player.setAttribute('aria-label', [title,labels[view],single||repeated?methodLabels[activeMethod]:''].filter(Boolean).join(' · '));
    controls.hidden = !(single || repeated);
    panel.querySelectorAll('[data-method]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.method === activeMethod)));
    panel.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    player.load();
  }
  panel.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => {
    if (view === b.dataset.view) return;
    view = b.dataset.view; loadVideo();
  }));
  panel.querySelectorAll('[data-method]').forEach(b => b.addEventListener('click', () => {
    if (view === 'more') { if (repeatMethod === b.dataset.method) return; repeatMethod = b.dataset.method; }
    else { if (method === b.dataset.method) return; method = b.dataset.method; }
    loadVideo();
  }));
});
// Decorative homepage loops can play together; full players remain exclusive.
const fullPlayers = [...document.querySelectorAll('video:not(.hero-preview)')];
const previews = [...document.querySelectorAll('.hero-preview')];
const previewToggle = document.querySelector('.preview-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const visiblePreviews = new Set();
let previewsEnabled = !reducedMotion.matches;
previews.forEach(video => { video.autoplay = false; video.muted = true; video.pause(); });
function syncPreviews() {
  const allowed = previewsEnabled && !document.hidden && !fullPlayers.some(v => !v.paused && !v.ended);
  previews.forEach(video => {
    if (allowed && visiblePreviews.has(video)) video.play().catch(() => {});
    else video.pause();
  });
  previewToggle.setAttribute('aria-pressed', String(previewsEnabled));
  previewToggle.querySelector('.preview-pause').toggleAttribute('hidden', !previewsEnabled);
  previewToggle.querySelector('.preview-play').toggleAttribute('hidden', previewsEnabled);
}
const previewObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) visiblePreviews.add(entry.target);
    else visiblePreviews.delete(entry.target);
  });
  syncPreviews();
}, {threshold: 0});
previews.forEach(video => previewObserver.observe(video));
previewToggle.hidden = false;
previewToggle.addEventListener('click', () => { previewsEnabled = !previewsEnabled; syncPreviews(); });
reducedMotion.addEventListener('change', event => { previewsEnabled = !event.matches; syncPreviews(); });
document.addEventListener('visibilitychange', syncPreviews);
fullPlayers.forEach(video => {
  video.addEventListener('play', () => {
    fullPlayers.forEach(other => { if (other !== video) other.pause(); });
    syncPreviews();
  });
  video.addEventListener('pause', syncPreviews);
  video.addEventListener('ended', syncPreviews);
});
syncPreviews();

const tabs = [...document.querySelectorAll('[data-result]')];
function selectFigure(key) {
  tabs.forEach(tab => {
    const active = tab.dataset.result === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
}
tabs.forEach((tab,index) => {
  tab.addEventListener('click', () => selectFigure(tab.dataset.result));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index+1)%tabs.length;
    if (event.key === 'ArrowLeft') next = (index+tabs.length-1)%tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length-1;
    if (next === undefined) return;
    event.preventDefault();selectFigure(tabs[next].dataset.result);tabs[next].focus();
  });
});
selectFigure('outcomes');
