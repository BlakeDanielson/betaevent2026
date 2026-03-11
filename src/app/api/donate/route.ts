import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { EVENT } from '@/lib/config';

const MIN_DONATION_CENTS = 100;   // $1.00
const MAX_DONATION_CENTS = 1000000; // $10,000.00

export async function POST(req: NextRequest) {
  try {
    const { amountInCents } = (await req.json()) as { amountInCents: number };

    if (
      !amountInCents ||
      !Number.isInteger(amountInCents) ||
      amountInCents < MIN_DONATION_CENTS ||
      amountInCents > MAX_DONATION_CENTS
    ) {
      return NextResponse.json(
        { error: 'Please enter a donation amount between $1 and $10,000.' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amountInCents,
            product_data: {
              name: `Donation — ${EVENT.donationTitle}`,
              description: `Supporting ${EVENT.orgName}`,
              metadata: { type: 'donation' },
            },
          },
          quantity: 1,
        },
      ],
      billing_address_collection: 'auto',
      metadata: {
        type:           'donation',
        amountInCents:  String(amountInCents),
      },
      // Allow donors to add a note via custom field
      custom_fields: [
        {
          key:   'donor_note',
          label: { type: 'custom', custom: 'Optional message (e.g., "In memory of…")' },
          type:  'text',
          optional: true,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&type=donation`,
      cancel_url:  `${baseUrl}/#donate`,
      expires_at:  Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[donate] Error creating session:', err);
    return NextResponse.json(
      { error: 'Failed to create donation session. Please try again.' },
      { status: 500 }
    );
  }
}
