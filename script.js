// ==========================================
// EDIT INI: Tanggal ulang tahun Chika
// Format: bulan (0-11), tanggal, tahun
// Contoh: 5 = Juni (0-indexed)
// ==========================================
const BIRTHDAY_MONTH = 5; // Ganti: 0=Jan, 1=Feb, ..., 11=Des
const BIRTHDAY_DAY = 26; // Ganti ke tanggal Chika
const BIRTHDAY_YEAR_OVERRIDE = null; // null = otomatis tahun ini/depan

// ==========================================
// PROGRESSIVE PHOTO REVEAL (Intersection Observer)
// ==========================================
const revealTargets = document.querySelectorAll(".reveal-target");

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || "0", 10);
        setTimeout(() => {
          el.classList.add("revealed");
          if (el.classList.contains("polaroid")) {
            fireConfetti(15);
          }
          if (el.classList.contains("footer-avatar")) {
            fireConfetti(60);
          }
        }, delay);
        io.unobserve(el);
      }
    });
  },
  { threshold: 0.25, rootMargin: "0px 0px -50px 0px" }
);

revealTargets.forEach((el) => io.observe(el));

// ==========================================
// COUNTDOWN
// ==========================================
function getNextBirthday() {
  const now = new Date();
  let year = BIRTHDAY_YEAR_OVERRIDE || now.getFullYear();
  let bd = new Date(year, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0);
  if (bd < now && !BIRTHDAY_YEAR_OVERRIDE) {
    bd = new Date(year + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0);
  }
  return bd;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  const target = getNextBirthday();
  const now = new Date();
  const diff = target - now;
  const label = document.getElementById("target-date-label");
  const options = { day: "numeric", month: "long", year: "numeric" };
  label.textContent = "Menuju: " + target.toLocaleDateString("id-ID", options);

  if (diff <= 0) {
    document.getElementById("countdown-grid").style.display = "none";
    const banner = document.getElementById("bday-banner");
    banner.style.display = "block";
    fireConfetti(150);
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  document.getElementById("cd-days").textContent = pad(days);
  document.getElementById("cd-hours").textContent = pad(hours);
  document.getElementById("cd-min").textContent = pad(mins);
  document.getElementById("cd-sec").textContent = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ==========================================
// SURPRISE BUTTON - dengan foto reveal
// Foto 7, 8, 9, 10 muncul progresif
// ==========================================
const surprises = [
  { photo: "assets/7.png", emoji: "🌟", msg: "Kamu adalah bintang paling terang di langitku! Tetap bersinar ya, Chika! ✨" },
  { photo: "assets/8.png", emoji: "🦋", msg: "Kamu sudah tumbuh menjadi kupu-kupu yang cantik luar dalam. Selamat ulang tahun! 🦋" },
  { photo: "assets/9.png", emoji: "🌸", msg: "Seperti bunga yang mekar indah — semoga hidup Chika selalu berwarna dan harum! 🌸" },
  { photo: "assets/10.png", emoji: "💫", msg: "Semua impianmu layak jadi nyata. Percaya diri ya, Chika! You got this! 💪✨" },
  // Setelah 4 foto pertama, cycle ulang dengan pesan tambahan
  { photo: "assets/7.png", emoji: "🍰", msg: "Satu kue tidak cukup untuk merayakan keistimewaanmu, Chika! Kamu luar biasa! 🎂" },
  { photo: "assets/8.png", emoji: "🌈", msg: "Badai pasti berlalu, dan pelangi indah menunggumu di baliknya. Happy birthday! 🌈" },
  { photo: "assets/9.png", emoji: "🎶", msg: "Hidup itu seperti lagu — ada nada tinggi dan rendah, tapi tetap indah karena dijalani. 🎵" },
  { photo: "assets/10.png", emoji: "🍓", msg: "Manis seperti strawberry, segar selalu jiwanya. Selamat ulang tahun, Chika! 🍓" },
];

let surpriseIdx = 0;
const TOTAL_NEW_PHOTOS = 4; // 4 foto baru sebelum cycle

function showSurprise() {
  const box = document.getElementById("surprise-box");
  const pick = surprises[surpriseIdx % surprises.length];

  document.getElementById("surprise-photo").src = pick.photo;
  document.getElementById("surprise-emoji").textContent = pick.emoji;
  document.getElementById("surprise-msg").textContent = pick.msg;

  box.classList.remove("visible");
  void box.offsetWidth; // reflow for re-animation
  box.classList.add("visible");

  // Update progress dots (max 4)
  const dots = document.querySelectorAll(".memory-progress .dot");
  dots.forEach((d, i) => {
    if (i <= Math.min(surpriseIdx, TOTAL_NEW_PHOTOS - 1)) {
      d.classList.add("active");
    }
  });

  fireConfetti(60);

  surpriseIdx++;

  const btn = document.getElementById("magic-btn");
  if (surpriseIdx < TOTAL_NEW_PHOTOS) {
    btn.textContent = "🎁 Buka Memori Berikutnya!";
  } else if (surpriseIdx < surprises.length) {
    btn.textContent = "💝 Pesan Manis Lagi!";
  } else {
    btn.textContent = "🔄 Ulang dari Awal!";
    surpriseIdx = 0;
    dots.forEach((d) => d.classList.remove("active"));
  }
}

// ==========================================
// CONFETTI
// ==========================================
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let pieces = [];

const COLORS = ["#FF6B9D", "#C77DFF", "#FFD166", "#06D6A0", "#FF9A5C", "#4CC9F0", "#FF4D6D", "#7B2FBE"];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function fireConfetti(count) {
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -10,
      r: Math.random() * 8 + 4,
      d: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngle: 0,
      tiltSpeed: Math.random() * 0.07 + 0.05,
      shape: Math.random() > 0.5 ? "rect" : "circle",
      opacity: 1,
    });
  }
  if (!animating) animate();
}

let animating = false;
function animate() {
  if (pieces.length === 0) {
    animating = false;
    return;
  }
  animating = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p, i) => {
    p.y += p.d + 1;
    p.tiltAngle += p.tiltSpeed;
    p.tilt = Math.sin(p.tiltAngle) * 12;
    p.opacity = Math.max(0, p.opacity - 0.008);

    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.translate(p.x + p.tilt, p.y);
    ctx.rotate(p.tiltAngle);

    if (p.shape === "rect") {
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  pieces = pieces.filter((p) => p.y < canvas.height + 20 && p.opacity > 0);
  requestAnimationFrame(animate);
}

// Initial confetti burst
setTimeout(() => fireConfetti(100), 600);
setTimeout(() => fireConfetti(80), 2000);

// ==========================================
// MUSIC - Web Audio API (no external file)
// ==========================================
let audioCtx = null;
let musicInterval = null;
let isPlaying = false;

// Simple Happy Birthday melody notes (freq, duration)
const melody = [
  [392, 300],
  [392, 150],
  [440, 450],
  [392, 450],
  [523, 450],
  [494, 900],
  [392, 300],
  [392, 150],
  [440, 450],
  [392, 450],
  [587, 450],
  [523, 900],
  [392, 300],
  [392, 150],
  [784, 450],
  [659, 450],
  [523, 450],
  [494, 450],
  [440, 900],
  [698, 300],
  [698, 150],
  [659, 450],
  [523, 450],
  [587, 450],
  [523, 900],
];

function playNote(freq, duration, startTime) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0.3, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration / 1000);
  osc.start(startTime);
  osc.stop(startTime + duration / 1000 + 0.05);
}

function playMelody() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let t = audioCtx.currentTime + 0.05;
  melody.forEach(([freq, dur]) => {
    playNote(freq, dur * 0.9, t);
    t += dur / 1000;
  });
  return t;
}

const musicBtn = document.getElementById("music-btn");

musicBtn.addEventListener("click", function () {
  if (isPlaying) {
    clearTimeout(musicInterval);
    isPlaying = false;
    musicBtn.textContent = "🎵";
    musicBtn.classList.remove("playing");
  } else {
    isPlaying = true;
    musicBtn.textContent = "🎶";
    musicBtn.classList.add("playing");
    const duration = playMelody();
    const ms = (duration - audioCtx.currentTime) * 1000;
    musicInterval = setTimeout(function loop() {
      if (!isPlaying) return;
      const d = playMelody();
      const ms2 = (d - audioCtx.currentTime) * 1000;
      musicInterval = setTimeout(loop, ms2 - 200);
    }, ms - 200);
  }
});
