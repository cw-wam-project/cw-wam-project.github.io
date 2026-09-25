/* Task metadata. Media paths point to the reviewed website handoff. */
const asset = path => `${path}?v=20260923-readable2`;
const tasks = {
  peg: {title: 'Square peg insertion', kicker: 'Tight-clearance contact', description: 'A 38 mm square peg enters a 40 mm square hole, leaving 1 mm clearance per side. Alignment and contact-guided adjustment matter throughout insertion.', observation: 'Compare contact search and seating across methods, then observe force feedback with CW-WAM + admittance.', stat: '5/20 → 14/20', statLabel: 'insertions · WAM → CW-WAM'},
  adapter: {title: 'Power-adapter insertion', kicker: 'Alignment and firm seating', description: 'The robot grasps a loosely placed adapter, inserts it firmly into another socket, and releases it. Successful insertion and successful release are distinct outcomes.', observation: 'Watch the approach, contact adjustment, and final seating. The comparison includes WAM, WAM + Wrench, CW-WAM, and CW-WAM + admittance.', stat: '8/20 → 19/20', statLabel: 'insertions · WAM → CW-WAM'},
  wiping: {title: 'Whiteboard wiping', kicker: 'Sustained contact', description: 'The robot maintains contact while wiping marker traces. All evaluated methods remove the simple test patterns in 20/20 trials, allowing the comparison to focus on force regulation.', observation: 'Compare contact-force behavior during wiping, particularly CW-WAM with and without admittance feedback.', stat: '1.99 → 1.34 N', statLabel: 'force-reference RMSE · CW-WAM → + admittance'},
  transport: {title: 'Spring-scale transport', kicker: 'Load-dependent motion', description: 'Visually identical 30 g and 830 g boxes hang from a spring scale. The heavier box stretches the scale farther, requiring a higher lift to clear the bin edge.', observation: 'Watch how lifting height changes with sensed load. The excerpt includes heavy-load comparisons and repeated trials.', stat: '30 g / 830 g', statLabel: 'light and heavy loads · identical appearance'}
};

const singleObservations = {
  peg: 'Watch the peg approach the opening and adjust during contact in this individual example.',
  adapter: 'Watch the adapter approach, contact adjustment, and seating in this individual example.',
  wiping: 'Watch the eraser maintain contact while the robot moves across the board.',
  transport: 'Watch the suspended box, scale extension, and lift as the robot moves between the bins.'
};

const methodLabels = {wam:'WAM', wam_wrench:'WAM + Wrench', cw_wam:'CW-WAM', cw_wam_admittance:'CW-WAM + Adm.'};
const methodSlugs = {wam:'wam', wam_wrench:'wam-wrench', cw_wam:'cw-wam', cw_wam_admittance:'cw-wam-admittance'};

// All three views share the same player; each task keeps its own selection.
const extraVideos = {
  peg: {file:'peg-examples', title:'Failure and successful insertion', note:'Failure and success examples · four methods · core actions at 5×.', observation:'Compare the peg–hole relationship at the end of individual failed and successful attempts.'},
  adapter: {file:'adapter-repeated', title:'20 consecutive attempts', note:'20 consecutive attempts · CW-WAM · prepared accelerated footage.', observation:'See repeated execution across the evaluation sequence, with successful insertion in 19 of 20 attempts.'},
  wiping: {file:'ink-removal', title:'Six wiping patterns', note:'Six patterns · CW-WAM · 85.9% mean ink removal.', observation:'Lines, curves, and letters reveal differences in surface coverage. Removal percentages compare the initial and remaining ink areas for these six selected patterns.'}
};

document.querySelectorAll('[data-task-panel]').forEach(panel => {
  const key = panel.dataset.taskPanel;
  const task = tasks[key];
  const player = panel.querySelector('.task-video');
  const methodControls = panel.querySelector('.single-method-controls');
  let view = 'comparison';
  let method = 'cw_wam';
  let repeatMethod = 'cw_wam';

  function loadVideo() {
    const single = view === 'single';
    const more = view === 'more';
    const repeated = more && key === 'transport';
    const selectedMethod = repeated ? repeatMethod : method;
    const label = methodLabels[selectedMethod];
    let filename = key;
    let poster = key;
    let title = 'Method comparison';
    let note = 'Method comparison · playback speeds and curve definitions are labeled in the video.';
    let observation = task.observation;
    if (single) {
      filename += '-' + methodSlugs[method];
      poster += method === 'cw_wam' ? '-single' : '-' + methodSlugs[method];
      title = `${label} single view`;
      note = `${label} single view · prepared clip; playback duration is not execution time.`;
      observation = `${label}: ${singleObservations[key]}`;
    } else if (repeated) {
      filename = poster = `transport-repeated-${methodSlugs[repeatMethod]}`;
      title = `${label}: repeated heavy-load trials`;
      note = `${label} · selected trials 01–08 · core lift/transport excerpts at 8×.`;
      observation = 'Watch eight selected heavy-load trials played consecutively in their supplied order. These examples are a subset of the evaluation trials.';
    } else if (more) {
      const extra = extraVideos[key];
      filename = poster = extra.file;
      title = extra.title;
      note = extra.note;
      observation = extra.observation;
    }
    const file = asset(`assets/videos/${filename}.mp4`);
    player.pause();
    player.poster = asset(`assets/images/${poster}-poster.jpg`);
    player.querySelector('source').src = file;
    const fallback = player.querySelector('a');
    fallback.href = file;
    fallback.textContent = `Download: ${task.title} · ${title}.`;
    player.setAttribute('aria-label', `${task.title} · ${title}`);
    player.width = repeated ? 640 : 1920;
    player.height = repeated ? 524 : 1080;
    methodControls.hidden = !(single || repeated);
    methodControls.setAttribute('aria-label', `${task.title}: choose a method${repeated ? ' for repeated trials' : ''}`);
    panel.querySelectorAll('[data-method]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.method === selectedMethod)));
    panel.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
    panel.querySelector('.task-media-note').textContent = note;
    panel.querySelector('.task-observation').textContent = observation;
    player.load();
  }
  panel.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.view === view) return;
    view = button.dataset.view;
    loadVideo();
  }));
  panel.querySelectorAll('[data-method]').forEach(button => button.addEventListener('click', () => {
    if (view === 'more') {
      if (button.dataset.method === repeatMethod) return;
      repeatMethod = button.dataset.method;
    } else {
      if (button.dataset.method === method) return;
      method = button.dataset.method;
    }
    loadVideo();
  }));
});

// A newly started video pauses all other task and overview players.
document.querySelectorAll('video').forEach(video => video.addEventListener('play', () => {
  document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
}));


// Public aggregate profiles. These curves are independent of the selected video.
(() => {
  const host = document.getElementById('profile-explorer');
  const chart = document.getElementById('profile-chart');
  const status = document.getElementById('profile-status');
  const taskSelect = document.getElementById('profile-task');
  const bands = document.getElementById('profile-bands');
  const buttons = [...document.querySelectorAll('[data-curve]')];
  const shown = new Set(buttons.map(b => b.dataset.curve));
  const styles = getComputedStyle(document.documentElement);
  const colors = {wam:styles.getPropertyValue('--wam').trim(),wam_wrench:styles.getPropertyValue('--wrench').trim(),cw_wam:styles.getPropertyValue('--cw').trim(),cw_wam_admittance:styles.getPropertyValue('--adm').trim()};
  let data;
  let phase = 50;
  let started = false;
  const ns = 'http://www.w3.org/2000/svg';
  const node = (tag, attrs = {}, text) => {
    const el = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const readout = document.createElement('div');
  readout.className = 'profile-readout';
  readout.innerHTML = '<label for="profile-phase">Inspect phase <output id="profile-phase-value" for="profile-phase">50%</output><input id="profile-phase" type="range" min="0" max="100" value="50" step="1" aria-label="Contact-phase progress percent"></label><div class="profile-values" id="profile-values"></div>';

  function render() {
    if (!data) return;
    const key = taskSelect.value;
    const group = data[key];
    const name = key === 'peg' ? 'Square peg insertion' : 'Whiteboard wiping';
    const width = Math.max(240, Math.round(chart.clientWidth));
    const height = width < 500 ? 300 : 370;
    const left = 48, right = width - 18, top = 35, bottom = height - 48;
    const maximum = Math.max(...Object.values(group).flatMap(points => points.map(p => Math.max(p[3], p[6]))));
    const ymax = Math.ceil(maximum / 5) * 5;
    const x = progress => left + progress / 100 * (right - left);
    const y = force => bottom - force / ymax * (bottom - top);
    const svg = node('svg', {viewBox:`0 0 ${width} ${height}`, width, height, role:'img', 'aria-labelledby':'profile-svg-title profile-svg-description'});
    svg.append(node('title',{id:'profile-svg-title'},`${name}: contact force by aligned phase`));
    svg.append(node('desc',{id:'profile-svg-description'},'Median measured force magnitude in newtons across successful trials. Optional interquartile bands and a dashed demonstration median. Use the method buttons and phase slider to inspect the values.'));
    svg.append(node('text',{x:left,y:17,fill:'#5d6878','font-size':13},'Force magnitude (N)'));
    for (let i = 0; i <= 5; i++) {
      const force = ymax * i / 5;
      svg.append(node('line',{x1:left,x2:right,y1:y(force),y2:y(force),stroke:'#e5eaf0'}));
      svg.append(node('text',{x:left-9,y:y(force)+4,'text-anchor':'end',fill:'#5d6878','font-size':12},Number(force.toFixed(1))));
    }
    for (const progress of [0,25,50,75,100]) {
      svg.append(node('text',{x:x(progress),y:bottom+22,'text-anchor':'middle',fill:'#5d6878','font-size':12},`${progress}`));
    }
    svg.append(node('text',{x:(left+right)/2,y:height-5,'text-anchor':'middle',fill:'#5d6878','font-size':13},'Aligned task phase (%)'));
    const line = (points, column) => points.map((p,i) => `${i?'L':'M'}${x(p[0]).toFixed(2)},${y(p[column]).toFixed(2)}`).join(' ');
    const band = (points, low, high, color) => {
      const d = line(points, high) + ' ' + [...points].reverse().map(p => `L${x(p[0]).toFixed(2)},${y(p[low]).toFixed(2)}`).join(' ') + ' Z';
      svg.append(node('path',{d,fill:color,'fill-opacity':.09,stroke:'none'}));
    };
    const demo = group.wam;
    if (bands.checked) {
      band(demo,4,6,'#4b5563');
      for (const method of shown) band(group[method],1,3,colors[method]);
    }
    for (const method of shown) svg.append(node('path',{d:line(group[method],2),fill:'none',stroke:colors[method],'stroke-width':method.startsWith('cw_')?2.6:1.8,'stroke-linejoin':'round'}));
    svg.append(node('path',{d:line(demo,5),fill:'none',stroke:'#586272','stroke-width':2,'stroke-dasharray':'6 5'}));
    svg.append(node('line',{x1:x(phase),x2:x(phase),y1:top,y2:bottom,stroke:'#8593a3','stroke-width':1,'stroke-dasharray':'3 4'}));
    chart.replaceChildren(svg);
    const closest = points => points.reduce((best,p) => Math.abs(p[0]-phase) < Math.abs(best[0]-phase) ? p : best);
    const values = document.getElementById('profile-values');
    values.replaceChildren();
    for (const method of shown) {
      const span = document.createElement('span');
      span.dataset.methodColor = method;
      span.textContent = `${methodLabels[method]}: ${closest(group[method])[2].toFixed(2)} N`;
      values.append(span);
    }
    const span = document.createElement('span');
    span.textContent = `Demonstration: ${closest(demo)[5].toFixed(2)} N`;
    values.append(span);
    document.getElementById('profile-phase-value').textContent = `${phase}%`;
    status.textContent = `${name} · ${shown.size} method${shown.size===1?'':'s'} shown · readout uses the nearest sampled phase.`;
  }
  async function start() {
    if (started) return;
    started = true;
    try {
      const response = await fetch(asset('assets/data/contact-profiles.json'));
      if (!response.ok) throw new Error('Profile data unavailable');
      data = await response.json();
      chart.after(readout);
      document.getElementById('profile-phase').addEventListener('input', event => { phase = Number(event.target.value); render(); });
      render();
      if ('ResizeObserver' in window) new ResizeObserver(render).observe(chart);
    } catch (_) {
      status.textContent = 'Interactive data could not load. Use the figure and CSV downloads below; local previews require the preview server.';
    }
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    const method = button.dataset.curve;
    shown.has(method) ? shown.delete(method) : shown.add(method);
    button.setAttribute('aria-pressed', String(shown.has(method)));
    render();
  }));
  taskSelect.addEventListener('change', render);
  bands.addEventListener('change', render);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); start(); }
    }, {rootMargin:'400px'});
    observer.observe(host);
  } else start();
})();
