// Shared scripts for every page.

/* ---------------------------------------------------------
   0. Ocean: sun rays, caustic light and drifting particles
   --------------------------------------------------------- */
(() => {
  const ocean = document.createElement('div');
  ocean.className = 'ocean';
  ocean.setAttribute('aria-hidden', 'true');
  ocean.innerHTML = '<div class="caustics"></div><div class="rays">' + '<i></i>'.repeat(6) + '</div>';
  document.body.prepend(ocean);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // marine snow: tiny specks drifting slowly upward and sideways
  const c = document.createElement('canvas');
  c.className = 'snow';
  c.setAttribute('aria-hidden', 'true');
  document.body.prepend(c);
  const ctx = c.getContext('2d');
  let W, H, dpr, specks = [];
  const make = () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.4 + 0.3,
    a: Math.random() * 0.45 + 0.08,
    vy: -(Math.random() * 0.18 + 0.04),
    vx: (Math.random() - 0.5) * 0.12,
    ph: Math.random() * Math.PI * 2
  });
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.round(W * H / 16000));
    specks = Array.from({ length: count }, make);
  };
  resize();
  addEventListener('resize', resize);

  let last = 0, running = true;
  const tick = t => {
    if (!running) return;
    const dt = Math.min(50, t - last) / 16.7; last = t;
    ctx.clearRect(0, 0, W, H);
    for (const p of specks) {
      p.ph += 0.01 * dt;
      p.x += (p.vx + Math.sin(p.ph) * 0.08) * dt;
      p.y += p.vy * dt;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5) p.x = W + 5; else if (p.x > W + 5) p.x = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 235, 255, ${p.a})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  // pause when the tab is hidden to save battery
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) { last = performance.now(); requestAnimationFrame(tick); }
  });
})();

/* ---------------------------------------------------------
   1. Opening animation: the name and intro rise in on load
   --------------------------------------------------------- */
requestAnimationFrame(() => document.documentElement.classList.add('loaded'));

/* ---------------------------------------------------------
   2. Click or tap your name to send a sweep of light across it
   (it still glints on its own every few seconds)
   --------------------------------------------------------- */
document.querySelectorAll('.hero h1').forEach(name => {
  name.addEventListener('click', () => {
    name.classList.remove('sweep');
    void name.offsetWidth;            // restart the animation if clicked again quickly
    name.classList.add('sweep');
  });
  name.addEventListener('animationend', e => {
    if (e.animationName === 'sweep') name.classList.remove('sweep');
  });
});

/* ---------------------------------------------------------
   3. Fade sections in as you scroll
   --------------------------------------------------------- */
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

/* ---------------------------------------------------------
   4. Full-screen video controls
   --------------------------------------------------------- */
document.querySelectorAll('.video-hero').forEach(hero => {
  const video = hero.querySelector('video');
  const fsBtn = hero.querySelector('[data-fullscreen]');
  const playBtn = hero.querySelector('[data-play]');

  // iPhone may block autoplay (e.g. Low Power Mode): show "Play" if so
  video.play().catch(() => { if (playBtn) playBtn.textContent = 'Play'; });

  if (fsBtn) fsBtn.addEventListener('click', () => {
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();   // iPhone
  });
  if (playBtn) playBtn.addEventListener('click', () => {
    if (video.paused) { video.play(); playBtn.textContent = 'Pause'; }
    else { video.pause(); playBtn.textContent = 'Play'; }
  });

  // clear nav over the video, solid nav after scrolling past it
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('clear', window.scrollY < hero.offsetHeight - 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});

/* ---------------------------------------------------------
   5. Tabs
   --------------------------------------------------------- */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

/* ---------------------------------------------------------
   6. Parts diagram: hover on a computer, tap on a phone
   --------------------------------------------------------- */
const light = name => {
  document.querySelectorAll('[data-part].on').forEach(x => x.classList.remove('on'));
  if (name) document.querySelectorAll('[data-part="' + name + '"]').forEach(x => x.classList.add('on'));
};
document.querySelectorAll('.diagram [data-part], .bom [data-part]').forEach(el => {
  el.addEventListener('mouseenter', () => light(el.dataset.part));
  el.addEventListener('mouseleave', () => light(null));
  el.addEventListener('click', () => light(el.classList.contains('on') ? null : el.dataset.part));
});
