/* Task metadata. Media paths point to the reviewed website handoff. */
const asset = path => `${path}?v=20260923-review1`;
const tasks = {
  peg: {title: 'Square peg insertion', kicker: 'Tight-clearance contact', description: 'A 38 mm square peg enters a 40 mm square hole, leaving 1 mm clearance per side. Alignment and contact-guided adjustment matter throughout insertion.', observation: 'Compare contact search and seating across methods, then observe force feedback with CW-WAM + admittance.', stat: '5/20 → 14/20', statLabel: 'insertions · WAM → CW-WAM'},
  adapter: {title: 'Power-adapter insertion', kicker: 'Alignment and firm seating', description: 'The robot grasps a loosely placed adapter, inserts it firmly into another socket, and releases it. Successful insertion and successful release are distinct outcomes.', observation: 'Watch the approach, contact adjustment, and final seating. The comparison includes WAM, WAM + Wrench, CW-WAM, and CW-WAM + admittance.', stat: '8/20 → 19/20', statLabel: 'insertions · WAM → CW-WAM'},
  wiping: {title: 'Whiteboard wiping', kicker: 'Sustained contact', description: 'The robot maintains contact while wiping marker traces. All evaluated methods remove the simple test patterns in 20/20 trials, allowing the comparison to focus on force regulation.', observation: 'Compare contact-force behavior during wiping, particularly CW-WAM with and without admittance feedback.', stat: '1.99 → 1.34 N', statLabel: 'force-reference RMSE · CW-WAM → + admittance'},
  transport: {title: 'Spring-scale transport', kicker: 'Load-dependent motion', description: 'Visually identical 30 g and 830 g boxes hang from a spring scale. The heavier box stretches the scale farther, requiring a higher lift to clear the bin edge.', observation: 'Watch how lifting height changes with sensed load. The excerpt includes heavy-load comparisons and repeated trials.', stat: '30 g / 830 g', statLabel: 'light and heavy loads · identical appearance'}
};

const singleObservations = {
  peg: 'Watch the peg approach the opening and adjust during contact in this CW-WAM example.',
  adapter: 'Watch the adapter approach, contact adjustment, and seating in this CW-WAM example.',
  wiping: 'Watch the eraser maintain contact while CW-WAM moves across the board.',
  transport: 'Watch the suspended box, scale extension, and lift as CW-WAM moves between the bins.'
};

const tabs = [...document.querySelectorAll('[role="tab"]')];
const player = document.getElementById('task-video');
let activeTask = 'peg';
let activeView = 'comparison';

function loadTaskVideo() {
  const task = tasks[activeTask];
  const isSingle = activeView === 'single';
  const file = `assets/videos/${activeTask}${isSingle ? '-cw-wam' : ''}.mp4`;
  player.pause();
  player.poster = asset(`assets/images/${activeTask}${isSingle ? '-single' : ''}-poster.jpg`);
  player.querySelector('source').src = asset(file);
  const fallback = player.querySelector('a');
  fallback.href = asset(file);
  fallback.textContent = `Download the ${task.title.toLowerCase()} video.`;
  player.setAttribute('aria-label', `${task.title} · ${isSingle ? 'CW-WAM single view' : 'method comparison'}`);
  document.getElementById('task-media-note').textContent = isSingle
    ? 'CW-WAM single view · prepared clip; playback duration is not execution time.'
    : 'Method comparison · playback speeds and curve definitions are labeled in the video.';
  document.getElementById('task-observation').textContent = isSingle
    ? singleObservations[activeTask] : task.observation;
  document.querySelectorAll('[data-view]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.view === activeView));
  });
  player.load();
}

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.view === activeView) return;
    activeView = button.dataset.view;
    loadTaskVideo();
  });
});

function selectTask(key) {
  if (!tasks[key] || key === activeTask) return;
  activeTask = key;
  const task = tasks[key];
  loadTaskVideo();
  for (const tab of tabs) {
    const selected = tab.dataset.task === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  document.getElementById('task-panel').setAttribute('aria-labelledby', `tab-${key}`);
  for (const [id, value] of Object.entries({'task-title': task.title, 'task-kicker': task.kicker, 'task-description': task.description})) {
    document.getElementById(id).textContent = value;
  }
  const stat = document.getElementById('task-stat');
  const label = document.createElement('span');
  label.textContent = task.statLabel;
  stat.replaceChildren(document.createTextNode(task.stat + ' '), label);
}

document.querySelectorAll('[data-task]').forEach(control => {
  control.addEventListener('click', () => selectTask(control.dataset.task));
});
tabs.forEach((tab, index) => tab.addEventListener('keydown', event => {
  let next;
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
  if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = tabs.length - 1;
  if (next === undefined) return;
  event.preventDefault();
  selectTask(tabs[next].dataset.task);
  tabs[next].focus();
}));

// Keep only one clip playing across the task, gallery, and full presentation players.
document.querySelectorAll('video').forEach(video => video.addEventListener('play', () => {
  document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
}));
