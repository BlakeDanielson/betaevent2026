// ─────────────────────────────────────────────────────────────────────────────
// EVENT CONFIGURATION — edit everything in this file to customize your event.
// All monetary values are in CENTS (e.g. 7500 = $75.00).
// ─────────────────────────────────────────────────────────────────────────────

export const EVENT = {
  // ── Basic Details ──────────────────────────────────────────────────────────
  name:        'Alpha Zeta Scholarship Gala and Reunion 2026',
  tagline:     '88 Years of Brotherhood.',
  date:        'Saturday, October 18, 2025',
  time:        '6:00 PM – 11:00 PM',
  doorsOpen:   '5:30 PM',
  location:    'The Grand Ballroom at The Marquette Hotel',
  address:     '710 Marquette Ave, Denver, CO 80210',
  description: `Join fellow Betas and distinguished brothers of the Alpha Zeta chapter for an
  unforgettable evening of cocktails, dinner, live music, and remarks from chapter leadership.
  Whether you graduated last spring or decades ago, this is your night to reconnect, reflect,
  and invest in the future of Beta Theta Pi at the University of Denver.`,

  // ── Schedule / Agenda ──────────────────────────────────────────────────────
  agenda: [
    { time: '5:30 PM', item: 'Doors open — cocktail hour & silent auction' },
    { time: '7:00 PM', item: 'Dinner service begins' },
    { time: '8:00 PM', item: 'Welcome remarks & scholarship recipient testimonials' },
    { time: '8:45 PM', item: 'Live band & dancing' },
    { time: '10:30 PM', item: 'Last call & farewell' },
  ],

  // ── Ticket Tiers ──────────────────────────────────────────────────────────
  tickets: [
    {
      id:          'general',
      name:        'General Admission',
      priceInCents: 7500,
      description: 'Includes dinner, open bar, and access to all event activities.',
      perks: [
        'Plated three-course dinner',
        'Open bar (beer, wine & spirits)',
        'Access to live music & dancing',
        'Silent auction participation',
      ],
      available: true,
      badge: null,
    },
    {
      id:           'vip',
      name:         'VIP Table',
      priceInCents: 15000,
      description:  'Reserved VIP seating for an elevated experience.',
      perks: [
        'Everything in General Admission',
        'Reserved front-section seating',
        'Priority check-in lane',
        'Commemorative keepsake gift',
        'Meet & greet with chapter leadership',
      ],
      available: true,
      badge: 'Most Popular',
    },
    {
      id:           'patron',
      name:         'Patron Sponsor',
      priceInCents: 30000,
      description:  'Support the chapter while enjoying the full VIP experience.',
      perks: [
        'Everything in VIP Table',
        'Name listed in event program',
        'Recognition during dinner remarks',
        'Tax-deductible contribution receipt',
        'Two complimentary tickets included',
      ],
      available: true,
      badge: 'Best Value',
    },
  ],

  // ── Donations ──────────────────────────────────────────────────────────────
  donationTitle:   'Support the Alpha Zeta Chapter Fund',
  donationBlurb: `Your generosity directly funds scholarships for active brothers,
  chapter improvements, and leadership development programs aligned with Beta Theta Pi's
  mission to develop Men of Principle. Every dollar makes a difference — thank you for
  investing in the next generation of Betas at DU.`,
  donationGoalInCents: 11000000,
  donationRaisedInCents: 1425000,
  donationPresets: [2500, 5000, 10000, 25000],

  // ── Contact & Social ───────────────────────────────────────────────────────
  contactEmail:  'MatthewSRumsey@gmail.com',
  contactName:   'Alpha Zeta Alumni Events Committee',
  social: {
    instagram: 'https://instagram.com/betathetapi',
    facebook:  'https://www.facebook.com/dubetathetapi',
    linkedin:  '',
    twitter:   'https://twitter.com/DU_Beta',
  },

  // ── Organization ──────────────────────────────────────────────────────────
  orgName:     'Alpha Zeta Chapter of Beta Theta Pi',
  orgFullName: 'Alpha Zeta Chapter of Beta Theta Pi — University of Denver',
  foundedYear: 1889,
};

// ─── Derived helpers ─────────────────────────────────────────────────────────

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
