// Shared scripts for every page.

/* ---------------------------------------------------------
   0. Golden spiral generator
   Builds a golden rectangle (1.618 : 1), cuts it into squares,
   and draws a quarter-circle in each square. Together the arcs
   form the golden spiral.
   --------------------------------------------------------- */
const PHI = (1 + Math.sqrt(5)) / 2;

function goldenSpiral({ squares = true, turns = 10, track = false } = {}) {
  const W = 1000 * PHI, H = 1000;
  let x = 0, y = 0, w = W, h = H;
  let d = '', rects = '';
  for (let i = 0; i < turns; i++) {
    const dir = i % 4;
    let s, x0, y0, x1, y1;
    if (dir === 0) {        // square on the left
      s = h; rects += `<rect class="sq" x="${x}" y="${y}" width="${s}" height="${s}"/>`;
      x0 = x; y0 = y + s; x1 = x + s; y1 = y;
      x += s; w -= s;
    } else if (dir === 1) { // square on top
      s = w; rects += `<rect class="sq" x="${x}" y="${y}" width="${s}" height="${s}"/>`;
      x0 = x; y0 = y; x1 = x + s; y1 = y + s;
      y += s; h -= s;
    } else if (dir === 2) { // square on the right
      s = h; rects += `<rect class="sq" x="${x + w - s}" y="${y}" width="${s}" height="${s}"/>`;
      x0 = x + w; y0 = y; x1 = x + w - s; y1 = y + s;
      w -= s;
    } else {                // square on the bottom
      s = w; rects += `<rect class="sq" x="${x}" y="${y + h - s}" width="${s}" height="${s}"/>`;
      x0 = x + w; y0 = y + h; x1 = x; y1 = y + h - s;
      h -= s;
    }
    if (i === 0) d += `M${x0.toFixed(2)} ${y0.toFixed(2)}`;
    d += ` A${s.toFixed(2)} ${s.toFixed(2)} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  const trackPath = track ? `<path class="track" d="${d}"/>` : '';
  return `<svg viewBox="-2 -2 ${W + 4} ${H + 4}" aria-hidden="true">${squares ? rects : ''}${trackPath}<path class="arc" d="${d}" pathLength="1"/></svg>`;
}

// Fill every element marked data-spiral="..."
document.querySelectorAll('[data-spiral]').forEach(el => {
  const type = el.dataset.spiral;
  el.classList.add('spiral');
  el.innerHTML = goldenSpiral({
    squares: type !== 'logo',
    turns: type === 'logo' ? 8 : 10,
    track: type === 'gauge'
  });
});

// Small spiral used as a mask for the section-heading glyph
(() => {
  const svg = goldenSpiral({ squares: false, turns: 8 })
    .replace('class="arc"', 'fill="none" stroke="black" stroke-width="70"');
  document.documentElement.style.setProperty('--spiral-mask', `url("data:image/svg+xml,${encodeURIComponent(svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'))}")`);
})();

// Spiral that draws over project images on hover
document.querySelectorAll('.project-image').forEach(img => {
  const s = document.createElement('div');
  s.className = 'spiral';
  s.innerHTML = goldenSpiral({ turns: 9 });
  img.appendChild(s);
});

/* ---------------------------------------------------------
   1. Loading screen: the spiral draws itself, then fades out.
   Shown once per visit (not on every page change).
   --------------------------------------------------------- */
const root = document.documentElement;
const loader = document.querySelector('.loader');
let seen = false;
try { seen = sessionStorage.getItem('spiralSeen') === '1'; } catch (e) {}

if (!loader || seen) {
  root.classList.add('skip-loader');
} else {
  loader.querySelector('.spiral')?.classList.add('draw');
  const start = performance.now();
  const finish = () => {
    const wait = Math.max(0, 1900 - (performance.now() - start));  // let the spiral finish drawing
    setTimeout(() => {
      root.classList.add('loaded');
      try { sessionStorage.setItem('spiralSeen', '1'); } catch (e) {}
    }, wait);
  };
  if (document.readyState === 'complete') finish(); else window.addEventListener('load', finish);
  setTimeout(() => root.classList.add('loaded'), 3500);  // never wait longer than this
}

// The big layout spiral behind the name draws in after the loader
document.querySelectorAll('.hero-guide').forEach(g => {
  setTimeout(() => g.classList.add('draw'), seen ? 100 : 1500);
});

/* ---------------------------------------------------------
   2. Scroll gauge: small spiral bottom-right fills as you scroll.
   Tap it to go back to the top.
   --------------------------------------------------------- */
const gauge = document.querySelector('.gauge');
if (gauge) {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    gauge.style.setProperty('--progress', (1 - p).toFixed(4));
    gauge.classList.toggle('show', window.scrollY > window.innerHeight * 0.5);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  gauge.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

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
