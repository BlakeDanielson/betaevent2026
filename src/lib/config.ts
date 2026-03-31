// ─────────────────────────────────────────────────────────────────────────────
// EVENT CONFIGURATION — edit everything in this file to customize your event.
// All monetary values are in CENTS (e.g. 7500 = $75.00).
// ─────────────────────────────────────────────────────────────────────────────

export const EVENT = {
  // ── Basic Details ──────────────────────────────────────────────────────────
  name:        'Alpha Zeta Scholarship Gala and Reunion 2026',
  tagline:     '88 Years of Brotherhood.',
  date:        'Saturday, May 30, 2026',
  time:        '5:00 PM to 10:00 PM',
  doorsOpen:   '5:00 PM',
  location:    'SIE International Relations Complex',
  address:     '2280 S Race St, Denver, CO 80210',
  description: `Come spend an evening with your brothers. We'll share a meal, hear from scholarship recipients about the difference your support has made, and close out the night with live music and good company. Whether you graduated last year or decades ago, this is a night to reconnect and invest in the future of Beta Theta Pi at DU.`,

  // ── Schedule / Agenda ──────────────────────────────────────────────────────
  agenda: [
    { time: '5:00 PM', item: 'Welcome and happy hour. Arrive, check in, and catch up with fellow alumni and brothers.' },
    { time: '6:30 PM', item: 'Dinner begins. Opening remarks and a warm welcome to get the evening started.' },
    { time: '7:00 PM', item: 'Program. Scholarship recipients share their stories, followed by a giving moment and recognition of our supporters.' },
    { time: '9:00 PM', item: 'Live band and celebration. Close out the night with music, dancing, and good conversation.' },
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
  donationBlurb: `Your gift goes directly toward scholarships for active brothers and helps keep the chapter strong for the next generation. Every dollar makes a real difference, and we're grateful for your support of Beta Theta Pi at DU.`,
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
  orgFullName: 'Alpha Zeta Chapter of Beta Theta Pi at the University of Denver',
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
