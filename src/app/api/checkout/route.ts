import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { EVENT } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const { ticketId, quantity } = (await req.json()) as {
      ticketId: string;
      quantity: number;
    };

    // Validate inputs
    if (!ticketId || !quantity || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: 'Invalid ticket selection.' },
        { status: 400 }
      );
    }

    const tier = EVENT.tickets.find((t) => t.id === ticketId);
    if (!tier || !tier.available) {
      return NextResponse.json(
        { error: 'Ticket tier not found or unavailable.' },
        { status: 404 }
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
            unit_amount: tier.priceInCents,
            product_data: {
              name: `${EVENT.name} — ${tier.name}`,
              description: tier.description,
              metadata: {
                event:    EVENT.name,
                ticketId: tier.id,
              },
            },
          },
          quantity,
        },
      ],
      // Collect billing details so we have the buyer's name & email
      billing_address_collection: 'auto',
      customer_email: undefined, // Stripe will collect it during checkout
      // Require a phone number at checkout so we can reach the buyer
      phone_number_collection: { enabled: true },
      metadata: {
        type:     'ticket',
        ticketId: tier.id,
        quantity: String(quantity),
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&type=ticket`,
      cancel_url:  `${baseUrl}/#tickets`,
      // Optional: set expiry (default 24 h, max 24 h)
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] Error creating session:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
