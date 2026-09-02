/**
 * THE DSTRCT & PHAT PINK LACES — INTERACTIVE & SCROLLYTELLING ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  initIrisOpener();
  initScrollytelling();
  initCountdownTimer();
  initEmailCapture();
  initVintageAtmosphere();
  initEmblemParallax();
});

/* ==========================================================================
   1. 1920s SILENT MOVIE IRIS REVEAL CONTROLLER
   ========================================================================== */
function initIrisOpener() {
  const overlay = document.getElementById('irisOverlay');
  const leaderNum = document.getElementById('leaderNumber');
  if (!overlay || !leaderNum) return;

  let count = 3;
  const timer = setInterval(() => {
    count--;
    if (count > 0) {
      leaderNum.textContent = count;
    } else {
      clearInterval(timer);
      leaderNum.textContent = 'GO';
      setTimeout(() => {
        overlay.classList.add('opacity-0', 'pointer-events-none');
      }, 400);
    }
  }, 600);
}

/* ==========================================================================
   2. FLOWING SCROLLYTELLING OBSERVER
   ========================================================================== */
function initScrollytelling() {
  const elements = document.querySelectorAll('.scrolly-reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger reveal slightly based on DOM position
        setTimeout(() => {
          entry.target.classList.add('scrolly-visible');
        }, 100);
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));

  // Dynamic header background on scroll
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('bg-black/95', 'shadow-lg');
    } else {
      header.classList.remove('bg-black/95', 'shadow-lg');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. FIGHT WEEK COUNTDOWN TIMER (March 3, 2027)
   ========================================================================== */
function initCountdownTimer() {
  const daysEl = document.getElementById('daysVal');
  const hoursEl = document.getElementById('hoursVal');
  const minsEl = document.getElementById('minsVal');
  const secsEl = document.getElementById('secsVal');
  if (!daysEl) return;

  // Target: March 3, 2027 18:00:00 PST (T-Mobile Arena Las Vegas)
  const targetDate = new Date('2027-03-03T18:00:00-08:00').getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. VIP EMAIL CAPTURE & LOCAL STORAGE BACKUP
   ========================================================================== */
function initEmailCapture() {
  const form = document.getElementById('emailCaptureForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const subCountText = document.getElementById('subCountText');

  if (!form || !feedback) return;

  // Display initial cached count
  const storedSubs = JSON.parse(localStorage.getItem('dstrct_subscribers') || '[]');
  if (storedSubs.length > 0 && subCountText) {
    subCountText.textContent = `${storedSubs.length + 142} VIPs Registered`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('userEmail');
    const selectedCategory = form.querySelector('input[name="interestGroup"]:checked')?.value || 'General VIP';
    const email = emailInput?.value.trim().toLowerCase();

    if (!email || !email.includes('@')) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    btnText.textContent = 'REGISTERING...';

    const payload = {
      email,
      category: selectedCategory,
      timestamp: new Date().toISOString(),
      source: 'thedstrct_landing'
    };

    try {
      // 1. Try posting to serverless API if available
      let apiSuccess = false;
      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) apiSuccess = true;
      } catch (err) {
        apiSuccess = false;
      }

      // 2. Always persist locally as backup
      const existing = JSON.parse(localStorage.getItem('dstrct_subscribers') || '[]');
      existing.push(payload);
      localStorage.setItem('dstrct_subscribers', JSON.stringify(existing));

      // 3. Play chime sound if enabled
      playRingBell();

      // 4. Update UI
      showFeedback(`🎉 Welcome to Ringside! You are registered for ${selectedCategory}. Check your inbox for updates.`, 'success');
      form.reset();
      if (subCountText) {
        subCountText.textContent = `${existing.length + 142} VIPs Registered`;
      }
    } catch (err) {
      showFeedback('An unexpected error occurred. Please try again or contact onie.rivers@gmail.com directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'JOIN WAITLIST';
    }
  });

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.classList.remove('hidden', 'bg-red-900/50', 'text-red-300', 'border-red-500', 'bg-green-900/50', 'text-green-300', 'border-green-500', 'border');
    if (type === 'success') {
      feedback.classList.add('bg-green-950', 'text-green-300', 'border', 'border-green-500');
    } else {
      feedback.classList.add('bg-red-950', 'text-red-300', 'border', 'border-red-500');
    }
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Keyboard shortcut (Shift + E) or click footer copyright to export CSV
  window.exportSubscribersCSV = function() {
    const list = JSON.parse(localStorage.getItem('dstrct_subscribers') || '[]');
    if (!list.length) {
      alert('No subscribers registered yet on this device.');
      return;
    }
    let csv = 'Email,Category,Timestamp,Source\n';
    list.forEach(item => {
      csv += `"${item.email}","${item.category}","${item.timestamp}","${item.source}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the_dstrct_vip_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
}

/* ==========================================================================
   5. VINTAGE ATMOSPHERE & WEB AUDIO SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let isAudioActive = false;

function initVintageAtmosphere() {
  const toggleBtn = document.getElementById('soundToggle');
  const iconOff = document.getElementById('soundIconOff');
  const iconOn = document.getElementById('soundIconOn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioActive = !isAudioActive;
    if (isAudioActive) {
      iconOff.classList.add('hidden');
      iconOn.classList.remove('hidden');
      playRingBell();
    } else {
      iconOff.classList.remove('hidden');
      iconOn.classList.add('hidden');
    }
  });
}

function playRingBell() {
  if (!audioCtx) return;
  try {
    // Synthesize clear boxing bell chime (800Hz with overtone)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(820, audioCtx.currentTime); // Metallic ring

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1640, audioCtx.currentTime); // Harmonic

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 1.8);
    osc2.stop(audioCtx.currentTime + 1.8);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

/* ==========================================================================
   6. 3D HERO EMBLEM PARALLAX TILT
   ========================================================================== */
function initEmblemParallax() {
  const container = document.getElementById('heroEmblemContainer');
  if (!container) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 16;
    const rotateY = (x / rect.width) * 16;

    container.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  container.addEventListener('mouseleave', () => {
    container.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  });
}
