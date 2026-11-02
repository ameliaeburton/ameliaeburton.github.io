// Shared scripts for every page.

// 1. Fade sections in as you scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

// 2. Full-screen video controls
document.querySelectorAll('.video-hero').forEach(hero => {
  const video = hero.querySelector('video');
  const fsBtn = hero.querySelector('[data-fullscreen]');
  const playBtn = hero.querySelector('[data-play]');

  // iPhone sometimes blocks autoplay (e.g. Low Power Mode): show a play label if so
  const tryPlay = () => video.play().catch(() => { if (playBtn) playBtn.textContent = 'Play'; });
  tryPlay();

  if (fsBtn) fsBtn.addEventListener('click', () => {
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();   // iPhone
  });

  if (playBtn) playBtn.addEventListener('click', () => {
    if (video.paused) { video.play(); playBtn.textContent = 'Pause'; }
    else { video.pause(); playBtn.textContent = 'Play'; }
  });

  // light nav while over the video, solid nav after scrolling past it
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('clear', window.scrollY < hero.offsetHeight - 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});

// 3. Tabs (camera mount components)
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// 4. Balloon diagram: hover on a computer, tap on a phone
const partEls = document.querySelectorAll('.diagram [data-part], .bom [data-part]');
const light = name => {
  document.querySelectorAll('[data-part].on').forEach(x => x.classList.remove('on'));
  if (name) document.querySelectorAll('[data-part="' + name + '"]').forEach(x => x.classList.add('on'));
};
partEls.forEach(el => {
  el.addEventListener('mouseenter', () => light(el.dataset.part));
  el.addEventListener('mouseleave', () => light(null));
  el.addEventListener('click', () => light(el.classList.contains('on') ? null : el.dataset.part));
});
