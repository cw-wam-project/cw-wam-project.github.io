// Both result sections share the same keyboard-accessible tab behavior.
(function () {
  function setupTabs(attribute, defaultKey) {
    const tabs = [...document.querySelectorAll(`[${attribute}]`)];
    if (!tabs.length) return;
    function select(key) {
      tabs.forEach(tab => {
        const active = tab.getAttribute(attribute) === key;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        panel.hidden = !active;
        if (!active) panel.querySelectorAll('video').forEach(video => video.pause());
      });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab.getAttribute(attribute)));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        select(tabs[next].getAttribute(attribute));
        tabs[next].focus();
      });
    });
    select(defaultKey);
  }
  setupTabs('data-result', 'profiles');
  setupTabs('data-simulation', 'profiles');
})();
