# Beta Theta Pi — Alpha Zeta Chapter Event Website

A production-ready single-page event website with Stripe ticket sales and donations,
built with **Next.js 14 (App Router) + Tailwind CSS** for the Alpha Zeta chapter at the
University of Denver.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# → fill in all values (see "Environment Variables" below)

# 3. Run locally
npm run dev
# → open http://localhost:3000
```

---

## Customizing the Event

**All event content lives in one file: `src/lib/config.ts`**

Open it and edit:
- Event name, date, time, location, description
- Agenda items
- Ticket tiers and prices (in cents)
- Donation presets and goal
- Contact info and social links
- Organization name

**Chapter colors** — edit `tailwind.config.ts`:
```ts
'beta-blue':  '#1B3A5C',  // ← primary (Beta blue)
'beta-pink':  '#C4697C',  // ← accent (Beta pink)
'beta-cream': '#FAF7F2',  // ← background
```

**Logo/Crest** — replace `public/crest.svg` with your actual crest.
- SVG preferred; PNG also works (update `<Image src>` in `Navbar.tsx` and `Footer.tsx`)

**Hero background** — in `src/components/Hero.tsx`, replace the gradient `<div>` with:
```tsx
<Image src="/hero-bg.jpg" alt="" fill className="object-cover" priority />
```
Then place `hero-bg.jpg` in `/public/`.

---

## Environment Variables

Copy `.env.local.example` → `.env.local` and fill in:

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | From Stripe Dashboard → API Keys (use `sk_test_…` for dev) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe Dashboard (use `pk_test_…` for dev) |
| `STRIPE_WEBHOOK_SECRET` | From `stripe listen` output (dev) or Stripe Dashboard (prod) |
| `RESEND_API_KEY` | Optional — enables email confirmations |
| `RESEND_FROM_EMAIL` | Your verified domain sender (e.g. `events@yourdomain.com`) |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Optional — see "Google Sheets Logging" below |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` (dev) or your Vercel URL (prod) |

---

## Stripe Setup

### 1. Create a Stripe account
Go to [dashboard.stripe.com](https://dashboard.stripe.com) and create an account.

### 2. Get API keys
- Dashboard → Developers → API keys
- Copy the **Secret key** and **Publishable key** into `.env.local`

### 3. Set up webhook (local development)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Log in
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhook

# The CLI will print your webhook signing secret — add it to .env.local as:
# STRIPE_WEBHOOK_SECRET=whsec_…
```

### 4. Set up webhook (production)
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://your-domain.com/api/webhook`
3. Events to listen for: `checkout.session.completed`
4. Copy the signing secret into Vercel environment variables

### 5. Switch to live keys for production
Replace `sk_test_…` / `pk_test_…` with `sk_live_…` / `pk_live_…` in Vercel.

---

## Email Confirmations (Resend)

1. Create a free [Resend](https://resend.com) account
2. Verify your sending domain at [resend.com/domains](https://resend.com/domains)
3. Create an API key at [resend.com/api-keys](https://resend.com/api-keys)
4. Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to `.env.local`

Email confirmations are sent automatically after each successful payment via the Stripe webhook.

---

## Google Sheets Logging (Optional)

This creates a live spreadsheet log of all ticket buyers and donors.

### 1. Create the spreadsheet
- Open [Google Sheets](https://sheets.google.com) → create a new sheet
- Add headers in row 1:
  `Timestamp | Type | Name | Email | Ticket Type | Qty | Amount | Session ID`

### 2. Create the Apps Script web app
- Extensions → Apps Script → paste this code:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
  sheet.appendRow([
    data.timestamp,
    data.type,
    data.name,
    data.email,
    data.ticketType,
    data.quantity,
    data.amount,
    data.sessionId,
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

- Replace `YOUR_SHEET_ID` with the ID from your sheet's URL
- Deploy → New deployment → Web app
  - Execute as: **Me**
  - Who has access: **Anyone**
- Copy the deployment URL → paste as `GOOGLE_SHEETS_WEBHOOK_URL` in `.env.local`

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set production environment variables
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
# ... repeat for all variables

# Or set them in the Vercel Dashboard:
# Project → Settings → Environment Variables
```

After deploying, set `NEXT_PUBLIC_BASE_URL` to your production URL (e.g., `https://your-event.vercel.app`).

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Main page (assembles all sections)
│   ├── globals.css         # Tailwind base + custom utilities
│   ├── success/
│   │   └── page.tsx        # Post-payment thank-you page
│   └── api/
│       ├── checkout/
│       │   └── route.ts    # Create ticket Stripe Checkout session
│       ├── donate/
│       │   └── route.ts    # Create donation Stripe Checkout session
│       └── webhook/
│           └── route.ts    # Stripe webhook → email + Sheets logging
├── components/
│   ├── Navbar.tsx          # Sticky nav with mobile menu
│   ├── Hero.tsx            # Full-screen hero with CTAs
│   ├── About.tsx           # Event details + timeline
│   ├── Tickets.tsx         # Ticket tier cards with qty selector
│   ├── Donate.tsx          # Donation presets + custom amount + progress bar
│   └── Footer.tsx          # Contact info, social links, copyright
└── lib/
    ├── config.ts           # ← All event content — edit this first
    ├── resend.ts           # Resend email client
    └── stripe.ts           # Stripe SDK instance
```

---

## Checklist Before Going Live

- [ ] Replace all content in `src/lib/config.ts`
- [ ] Update colors in `tailwind.config.ts`
- [ ] Replace `public/crest.svg` with actual Beta crest
- [ ] Add hero background image (`/public/hero-bg.jpg`)
- [ ] Stripe live keys added to Vercel
- [ ] Stripe production webhook created and secret added
- [ ] Resend domain verified (if using email)
- [ ] Google Sheets script deployed (if using Sheets logging)
- [ ] Test full purchase flow end-to-end in production
- [ ] Verify confirmation emails arrive

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Playfair Display + Inter fonts |
| Payments | Stripe Checkout (redirect flow) |
| Email | Resend |
| Data logging | Google Sheets via Apps Script webhook |
| Deployment | Vercel |
