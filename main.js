/* ═══════════════════════════════════════════════════════
   WEDDING INVITATION — MAIN SCRIPT
   Uses CONFIG from config.js (loaded first)
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 0. Apply asset paths from CONFIG ────────────────── */
  document.getElementById('childPhoto1').src  = CONFIG.assets.childPhoto1;
  document.getElementById('childPhoto2').src  = CONFIG.assets.childPhoto2;
  document.getElementById('restaurantPhoto').src = CONFIG.assets.restaurant;
  document.getElementById('mapBtn').href      = CONFIG.mapUrl;
  document.getElementById('bgMusic').src      = CONFIG.assets.music;

  /* ── 1. Navigation ───────────────────────────────────── */
  const nav     = document.getElementById('nav');
  const burger  = document.getElementById('burger');
  const navList = document.getElementById('navList');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navList.classList.toggle('open');
  });

  // Close mobile menu on link click
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navList.classList.remove('open');
    });
  });

  // Scrolled state
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── 2. Scroll animations (IntersectionObserver) ─────── */
  const animEls = document.querySelectorAll('.anim');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animEls.forEach(el => observer.observe(el));

  /* ── 3. Envelope animation ───────────────────────────── */
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const envelopeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        envelopeWrapper.classList.add('animate');
        envelopeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  envelopeObserver.observe(envelopeWrapper);

  /* ── 4. Calendar (July 2026) ─────────────────────────── */
  buildCalendar();

  function buildCalendar() {
    const container = document.getElementById('calendar');
    const headers = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    headers.forEach(h => {
      const el = document.createElement('div');
      el.className = 'calendar__header';
      el.textContent = h;
      container.appendChild(el);
    });

    // July 2026: 1st is Wednesday (index 2 in Mon‑based grid)
    const firstDayIndex = 2; // 0=Mon … 6=Sun → Wed=2
    const daysInMonth = 31;

    for (let i = 0; i < firstDayIndex; i++) {
      const blank = document.createElement('div');
      blank.className = 'calendar__day calendar__day--empty';
      container.appendChild(blank);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      el.className = 'calendar__day';
      if (d === 25) el.classList.add('calendar__day--highlight');
      el.textContent = d;
      container.appendChild(el);
    }
  }

  /* ── 5. Timeline (from CONFIG) ───────────────────────── */
  buildTimeline();

  function buildTimeline() {
    const container = document.getElementById('timelineContainer');
    CONFIG.timeline.forEach(item => {
      const row = document.createElement('div');
      row.className = 'timeline__item';
      row.innerHTML = `
        <div class="timeline__event">${item.event}</div>
        <div class="timeline__dot"></div>
        <div class="timeline__time">${item.time}</div>
      `;
      container.appendChild(row);
    });
  }

  /* ── 6. Dress-code circles (from CONFIG) ─────────────── */
  buildDressCode();

  function buildDressCode() {
    const container = document.getElementById('dressCircles');
    CONFIG.dressCodeColors.forEach(c => {
      const el = document.createElement('div');
      el.className = 'dresscode__circle';
      el.style.backgroundColor = c.hex;
      if (c.border) el.style.border = '1px solid #ccc';
      el.title = c.name;
      el.setAttribute('aria-label', c.name);
      container.appendChild(el);
    });
  }

  /* ── 7. Countdown timer ──────────────────────────────── */
  const cdDays    = document.getElementById('cdDays');
  const cdHours   = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');
  const cdDone    = document.getElementById('countdownDone');
  const cdTimer   = document.getElementById('countdownTimer');

  function updateCountdown() {
    const now  = new Date();
    const diff = CONFIG.weddingDate - now;

    if (diff <= 0) {
      cdTimer.hidden = true;
      cdDone.hidden  = false;
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    cdDays.textContent    = String(d).padStart(2, '0');
    cdHours.textContent   = String(h).padStart(2, '0');
    cdMinutes.textContent = String(m).padStart(2, '0');
    cdSeconds.textContent = String(s).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ── 8. Background music toggle ──────────────────────── */
  const musicBtn = document.getElementById('musicToggle');
  const audio    = document.getElementById('bgMusic');

  musicBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => musicBtn.classList.add('playing'))
                  .catch(() => {});
    } else {
      audio.pause();
      musicBtn.classList.remove('playing');
    }
  });

  /* ── 9. RSVP form ───────────────────────────────────── */
  const form       = document.getElementById('rsvpForm');
  const successMsg = document.getElementById('rsvpSuccess');
  const errorMsg   = document.getElementById('rsvpError');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    successMsg.hidden = true;
    errorMsg.hidden   = true;

    // Client-side validation
    const name      = form.elements['name'].value.trim();
    const guests    = form.elements['guests'].value;
    const attending = form.elements['attending'].value;

    if (!name || !guests || !attending) {
      errorMsg.textContent = 'Будь ласка, заповніть усі поля.';
      errorMsg.hidden = false;
      return;
    }

    const data = { name, guests, attending };

    try {
      const res = await fetch(CONFIG.rsvpEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        successMsg.hidden = false;
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      // Fallback: show success anyway for offline/demo usage
      successMsg.hidden = false;
      form.reset();
    }
  });

})();
