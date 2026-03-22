/**
 * Central configuration for the wedding invitation.
 * Change asset paths or settings here — no need to edit HTML or other JS files.
 */
const CONFIG = {
  /* ── Asset paths ─────────────────────────────────────────── */
  assets: {
    childPhoto1: 'assets/child-photo-1.jpg',
    childPhoto2: 'assets/child-photo-2.jpg',
    restaurant:  'assets/restaurant.jpg',
    music:       'assets/background-music.mp3',
  },

  /* ── Wedding date (Kyiv time, UTC+3) ─────────────────────── */
  weddingDate: new Date('2026-07-25T13:00:00+03:00'),

  /* ── Location ────────────────────────────────────────────── */
  mapUrl: 'https://maps.app.goo.gl/Q6EKY1ifxwRkATdZ6',

  /* ── RSVP endpoint ───────────────────────────────────────── */
  // Replace with your Formspree / EmailJS / Google‑Form / backend URL
  rsvpEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',

  /* ── Timeline events (easy to extend) ────────────────────── */
  timeline: [
    { event: 'Збір гостей', time: '13:00', icon: 'assets/guests-summon.png', iconScale: 1.25 },
    { event: 'Церемонія',   time: '14:00', icon: 'assets/wedding-ceremony.png' },
  ],

  /* ── Dress‑code heart images (rows: brown, green, white) ── */
  dressCodeHearts: [
    // Row 1 — brown tones (dark → light)
    [
      { name: 'Dark Brown',  src: 'assets/dark-brown-heart.png' },
      { name: 'Brown',       src: 'assets/brown-heart.png' },
      { name: 'Light Brown', src: 'assets/light-brown-heart.png' },
    ],
    // Row 2 — green tones (dark → light)
    [
      { name: 'Dark Green',  src: 'assets/dark-green-heart.png' },
      { name: 'Green',       src: 'assets/green-heart.png' },
      { name: 'Light Green', src: 'assets/light-green-heart.png' },
    ],
    // Row 3 — white tones (darker → lighter)
    [
      { name: 'Beige',       src: 'assets/beige-heart.png' },
      { name: 'Cream',       src: 'assets/cream-heart.png' },
      { name: 'Snow White',  src: 'assets/snow-white-heart.png' },
    ],
  ],
};
