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
  const mobileMenuFadeDuration = 250;

  function openMenu() {
    nav.classList.add('open');
    burger.classList.add('open');
    navList.classList.add('open');
  }

  function closeMenu() {
    burger.classList.remove('open');
    navList.classList.remove('open');
    window.setTimeout(() => {
      if (!navList.classList.contains('open')) nav.classList.remove('open');
    }, mobileMenuFadeDuration);
  }

  burger.addEventListener('click', () => {
    if (navList.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close mobile menu on link click
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
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

      const scale = item.iconScale ? ` style="transform: scale(${item.iconScale})"` : '';
      const dotHTML = item.icon
        ? `<div class="timeline__dot timeline__dot--img"><img src="${item.icon}" alt="${item.event}"${scale} /></div>`
        : `<div class="timeline__dot"></div>`;

      row.innerHTML = `
        <div class="timeline__event">${item.event}</div>
        ${dotHTML}
        <div class="timeline__time">${item.time}</div>
      `;
      container.appendChild(row);
    });
  }

  /* ── 6. Dress-code hearts (from CONFIG) ────────────── */
  buildDressCode();

  function buildDressCode() {
    const container = document.getElementById('dressCircles');
    CONFIG.dressCodeHearts.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'dresscode__row';
      row.forEach(heart => {
        const el = document.createElement('img');
        el.className = 'dresscode__heart';
        el.src = heart.src;
        el.alt = heart.name;
        el.title = heart.name;
        el.setAttribute('aria-label', heart.name);
        rowEl.appendChild(el);
      });
      container.appendChild(rowEl);
    });
  }

  /* ── 7. Countdown timer ──────────────────────────────── */
  const cdDays    = document.getElementById('cdDays');
  const cdHours   = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');
  const cdDone    = document.getElementById('countdownDone');
  const cdTimer   = document.getElementById('countdownTimer');

  // Ukrainian plural forms: [nominative singular, nominative plural (2-4), genitive plural (5+)]
  function ukPlural(n, forms) {
    const abs = Math.abs(n);
    const mod100 = abs % 100;
    const mod10  = abs % 10;
    if (mod100 >= 11 && mod100 <= 19) return forms[2];
    if (mod10 === 1) return forms[0];
    if (mod10 >= 2 && mod10 <= 4) return forms[1];
    return forms[2];
  }

  const dayForms    = ['День', 'Дні', 'Днів'];
  const hourForms   = ['Годину', 'Години', 'Годин'];
  const minuteForms = ['Хвилину', 'Хвилини', 'Хвилин'];
  const secondForms = ['Секунду', 'Секунди', 'Секунд'];

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

    cdDays.parentElement.querySelector('small').textContent    = ukPlural(d, dayForms);
    cdHours.parentElement.querySelector('small').textContent   = ukPlural(h, hourForms);
    cdMinutes.parentElement.querySelector('small').textContent = ukPlural(m, minuteForms);
    cdSeconds.parentElement.querySelector('small').textContent = ukPlural(s, secondForms);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ── 8. Background music toggle ──────────────────────── */
  const musicBtn = document.getElementById('musicToggle');
  const audio    = document.getElementById('bgMusic');

  function updateMusicButton(isPlaying) {
    musicBtn.classList.toggle('playing', isPlaying);
    musicBtn.classList.toggle('muted', !isPlaying);
    musicBtn.textContent = isPlaying ? '🔊' : '🔇';
    musicBtn.setAttribute('aria-label', isPlaying ? 'Музика увімкнена' : 'Музика вимкнена');
    musicBtn.title = isPlaying ? 'Музика увімкнена' : 'Музика вимкнена';
  }

  async function tryPlayMusic() {
    try {
      await audio.play();
    } catch {
      updateMusicButton(false);
    }
  }

  audio.addEventListener('play', () => updateMusicButton(true));
  audio.addEventListener('pause', () => updateMusicButton(false));

  musicBtn.addEventListener('click', () => {
    if (audio.paused) {
      tryPlayMusic();
    } else {
      audio.pause();
    }
  });

  updateMusicButton(false);

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
    const attending = form.elements['attending'].value;

    if (!name || !attending) {
      errorMsg.textContent = 'Будь ласка, заповніть усі поля.';
      errorMsg.hidden = false;
      return;
    }

    const data = { name, attending };

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
