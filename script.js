// ==========================================
// STEP NAVIGATION (Wizard)
// ==========================================
const steps = document.querySelectorAll(".step");
const TOTAL_STEPS = steps.length;
let currentStep = 1;

function goToStep(n) {
  if (n < 1 || n > TOTAL_STEPS) return;
  const prev = document.querySelector(`.step[data-step="${currentStep}"]`);
  const next = document.querySelector(`.step[data-step="${n}"]`);
  if (!next) return;

  prev.classList.remove("active");
  prev.classList.add("exit");
  setTimeout(() => prev.classList.remove("exit"), 500);

  next.classList.add("active");
  currentStep = n;

  // Update progress bar
  document.getElementById("progress-fill").style.width = (n / TOTAL_STEPS) * 100 + "%";

  // Reset scroll inside the step
  next.scrollTop = 0;

  // Per-step entry effects
  onEnterStep(n);
}

function onEnterStep(n) {
  if (n === 1) {
    fireConfetti(80);
  }
  if (n === 4 || n === 5 || n === 6) {
    fireConfetti(40);
  }
  if (n === 8) {
    fireConfetti(150);
  }
}

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => goToStep(currentStep + 1));
});

document.getElementById("restart-btn").addEventListener("click", () => {
  resetAll();
  goToStep(1);
});

function resetAll() {
  // Reset cake
  document.querySelectorAll(".candle").forEach((c) => {
    c.classList.remove("lit", "blown");
  });
  candleLit = 0;
  document.getElementById("candle-count").textContent = "0";
  document.getElementById("cake-title").textContent = "Nyalain Lilinnya! 🕯️";
  document.getElementById("cake-desc").textContent = "Tap satu-satu lilin di bawah untuk menyalakannya. Make a wish ya, Chika!";
  document.getElementById("blow-btn").classList.add("hidden");
  document.getElementById("cake-next").classList.add("hidden");
  document.getElementById("cake-progress").classList.remove("hidden");

  // Reset music label
  isPlaying = false;
  const mb = document.getElementById("music-big-btn");
  mb.classList.remove("playing");
  mb.querySelector(".music-icon").textContent = "▶️";
  mb.querySelector(".music-label").textContent = "Play Music";
  document.getElementById("step2-next").classList.add("hidden");
  if (musicInterval) clearTimeout(musicInterval);

  // Reset surprise
  surpriseIdx = 0;
  document.getElementById("surprise-box").classList.remove("visible");
  document.getElementById("surprise-next").classList.add("hidden");
  document.querySelectorAll(".memory-progress .dot").forEach((d) => d.classList.remove("active"));
  document.getElementById("magic-btn").textContent = "🎁 Buka Hadiahku!";
  document.getElementById("magic-btn").classList.remove("hidden");
}

// ==========================================
// STEP 3 — CAKE: Light & Blow Candles
// ==========================================
let candleLit = 0;
const TOTAL_CANDLES = 5;

document.querySelectorAll(".candle").forEach((candle) => {
  candle.addEventListener("click", () => {
    if (candle.classList.contains("lit") || candle.classList.contains("blown")) return;
    candle.classList.add("lit");
    candleLit++;
    document.getElementById("candle-count").textContent = candleLit;
    fireConfetti(10);

    if (candleLit === TOTAL_CANDLES) {
      // All candles lit — show blow button
      setTimeout(() => {
        document.getElementById("cake-title").textContent = "Sekarang Tiup Lilinnya! 💨";
        document.getElementById("cake-desc").textContent = "Make a wish, lalu tap tombol untuk tiup lilinnya~";
        document.getElementById("cake-progress").classList.add("hidden");
        document.getElementById("blow-btn").classList.remove("hidden");
      }, 400);
    }
  });
});

document.getElementById("blow-btn").addEventListener("click", () => {
  document.querySelectorAll(".candle").forEach((c, i) => {
    setTimeout(() => {
      c.classList.remove("lit");
      c.classList.add("blown");
    }, i * 120);
  });
  fireConfetti(100);

  setTimeout(() => {
    document.getElementById("cake-title").textContent = "Yaaay! Wish-mu didengar 🌟";
    document.getElementById("cake-desc").textContent = "Sekarang waktunya baca ucapan spesial untuk kamu~";
    document.getElementById("blow-btn").classList.add("hidden");
    document.getElementById("cake-next").classList.remove("hidden");
  }, 800);
});

// ==========================================
// STEP 7 — SURPRISE BUTTON
// ==========================================
const surprises = [
  { photo: "assets/7.webp", emoji: "🌟", msg: "Wanita karir hebat dan kuat itu kamu! Semangat teru Ibu Chika!" },
  { photo: "assets/8.webp", emoji: "🦋", msg: "Doaku semoga kamu makin sukses dan jadi kepala sekolah SAC" },
  { photo: "assets/9.webp", emoji: "🌸", msg: "Mood booster banget kalau lagi sama kamu. Tetap sehat selalu ya!" },
  { photo: "assets/10.webp", emoji: "💫", msg: "Tahun depan harus lebih happy dari tahun ini. Semangat ngejar mimpi kamu!" },
];

let surpriseIdx = 0;

function showSurprise() {
  const box = document.getElementById("surprise-box");
  const pick = surprises[surpriseIdx];

  document.getElementById("surprise-photo").src = pick.photo;
  document.getElementById("surprise-emoji").textContent = pick.emoji;
  document.getElementById("surprise-msg").textContent = pick.msg;

  box.classList.remove("visible");
  void box.offsetWidth; // reflow for re-animation
  box.classList.add("visible");

  // Update progress dots
  const dots = document.querySelectorAll(".memory-progress .dot");
  dots.forEach((d, i) => {
    if (i <= surpriseIdx) d.classList.add("active");
  });

  fireConfetti(60);

  surpriseIdx++;

  const btn = document.getElementById("magic-btn");
  if (surpriseIdx < surprises.length) {
    btn.textContent = `🎁 Buka Lagi (${surpriseIdx}/${surprises.length})`;
  } else {
    // All revealed — hide magic button, show "Lanjut →" BELOW the card
    btn.classList.add("hidden");
    document.getElementById("surprise-next").classList.remove("hidden");
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
  pieces.forEach((p) => {
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

// Initial welcome burst
setTimeout(() => fireConfetti(120), 400);

// ==========================================
// STEP 2 — MUSIC (Web Audio API, no external file)
// ==========================================
let audioCtx = null;
let musicInterval = null;
let isPlaying = false;

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

const musicBigBtn = document.getElementById("music-big-btn");
const musicHint = document.getElementById("music-hint");

musicBigBtn.addEventListener("click", function () {
  if (isPlaying) {
    clearTimeout(musicInterval);
    isPlaying = false;
    musicBigBtn.classList.remove("playing");
    musicBigBtn.querySelector(".music-icon").textContent = "▶️";
    musicBigBtn.querySelector(".music-label").textContent = "Play Music";
  } else {
    isPlaying = true;
    musicBigBtn.classList.add("playing");
    musicBigBtn.querySelector(".music-icon").textContent = "🎶";
    musicBigBtn.querySelector(".music-label").textContent = "Music Playing...";

    musicHint.textContent = "🎵 Lagunya udah jalan, tap lanjut yuk!";

    const duration = playMelody();
    const ms = (duration - audioCtx.currentTime) * 1000;
    musicInterval = setTimeout(function loop() {
      if (!isPlaying) return;
      const d = playMelody();
      const ms2 = (d - audioCtx.currentTime) * 1000;
      musicInterval = setTimeout(loop, ms2 - 200);
    }, ms - 200);

    // Reveal lanjut button setelah music start
    document.getElementById("step2-next").classList.remove("hidden");
    fireConfetti(40);
  }
});
