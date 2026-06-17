/* ── ESTRELLAS Y COMETAS en canvas ── */
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let W, H, stars = [], comets = [];

function resize(){
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildStars();
}

function buildStars(){
  stars = [];
  const n = Math.floor((W * H) / 3000);
  for(let i = 0; i < n; i++){
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.75,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(),
      da: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
      phase: Math.random() * Math.PI * 2
    });
  }
}

let lastComet = 0;
function spawnComet(t){
  if(t - lastComet < 4000 + Math.random() * 6000) return;
  lastComet = t;
  const startX = Math.random() * W * 0.6 + W * 0.1;
  const startY = Math.random() * H * 0.4;
  const angle  = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
  const speed  = 800 + Math.random() * 600;
  const len    = 120 + Math.random() * 80;
  comets.push({ x: startX, y: startY, angle, speed, len, alpha: 0, life: 0, maxLife: 2.2 });
}

let last = 0;
function draw(ts){
  const dt = Math.min((ts - last) / 1000, 0.05);
  last = ts;

  ctx.clearRect(0, 0, W, H);

  /* estrellas */
  stars.forEach(s => {
    s.phase += s.da;
    const alpha = 0.3 + 0.5 * (Math.sin(s.phase) * 0.5 + 0.5);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(252,232,200,${alpha * s.a})`;
    ctx.fill();
  });

  /* cometas */
  spawnComet(ts);
  comets = comets.filter(c => c.life < c.maxLife);
  comets.forEach(c => {
    c.life += dt;
    c.x += Math.cos(c.angle) * c.speed * dt;
    c.y += Math.sin(c.angle) * c.speed * dt;

    const progress = c.life / c.maxLife;
    c.alpha = progress < 0.15 ? progress / 0.15 : progress > 0.75 ? 1 - (progress - 0.75) / 0.25 : 1;

    const tailX = c.x - Math.cos(c.angle) * c.len;
    const tailY = c.y - Math.sin(c.angle) * c.len;

    const grad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
    grad.addColorStop(0, `rgba(252,232,200,0)`);
    grad.addColorStop(1, `rgba(252,232,200,${c.alpha * 0.9})`);

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(c.x, c.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(c.x, c.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,240,210,${c.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

resize();
window.addEventListener('resize', resize);
requestAnimationFrame(draw);

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.section, .photo-section, .quote-block, .footer');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* muestra placeholder si la imagen no existe aún */
const img = document.getElementById('nasa-img');
if(img && img.getAttribute('src') === 'URL_DE_LA_FOTO_NASA_AQUI'){
  img.style.display = 'none';
  document.getElementById('photo-ph').style.display = 'flex';
}