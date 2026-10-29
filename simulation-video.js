// Keep simulation players exclusive, including in the standalone preview.
(() => {
  const videos = [...document.querySelectorAll('#simulation video')];
  videos.forEach(video => video.addEventListener('play', () => {
    videos.forEach(other => { if (other !== video) other.pause(); });
  }));
})();
