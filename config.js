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
    { event: 'Збір гостей', time: '13:00' },
    { event: 'Церемонія',   time: '14:00' },
  ],

  /* ── Dress‑code colours ──────────────────────────────────── */
  dressCodeColors: [
    { name: 'Dark Brown',  hex: '#5C4033' },
    { name: 'Light Brown', hex: '#C4A882' },
    { name: 'Beige',       hex: '#F5F0E6' },
    { name: 'Olive',       hex: '#808000' },
    { name: 'Sage Green',  hex: '#9CAF88' },
    { name: 'White',       hex: '#FFFFFF', border: true },
  ],
};
