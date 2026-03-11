import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { resend } from '@/lib/resend';
import { EVENT } from '@/lib/config';

// ── Google Sheets logging (optional) ────────────────────────────────────────
async function logToGoogleSheets(row: Record<string, string>) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(row),
    });
  } catch (err) {
    console.error('[webhook] Google Sheets logging failed:', err);
  }
}

// ── Email confirmation ────────────────────────────────────────────────────────
async function sendConfirmationEmail(
  toEmail: string,
  subject: string,
  htmlBody: string
) {
  if (!resend || !process.env.RESEND_FROM_EMAIL) return;

  try {
    await resend.emails.send({
      from:    `${EVENT.orgName} <${process.env.RESEND_FROM_EMAIL}>`,
      to:      toEmail,
      subject,
      html:    htmlBody,
    });
  } catch (err) {
    console.error('[webhook] Email send failed:', err);
  }
}

function ticketConfirmationHtml(
  name: string,
  ticketType: string,
  quantity: string,
  amount: string
) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h1 style="color:#1B3A5C;font-family:Georgia,serif;">You're confirmed!</h1>
      <p>Dear ${name},</p>
      <p>Your ticket purchase is confirmed. We look forward to seeing you!</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0;">
        <tr><td style="padding:8px 0;font-weight:bold;">Event:</td>
            <td style="padding:8px 0;">${EVENT.name}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;">Date:</td>
            <td style="padding:8px 0;">${EVENT.date} | ${EVENT.time}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;">Ticket:</td>
            <td style="padding:8px 0;">${ticketType}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;">Qty:</td>
            <td style="padding:8px 0;">${quantity}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;">Total:</td>
            <td style="padding:8px 0;">${amount}</td></tr>
      </table>
      <p style="color:#666;font-size:14px;">
        Questions? Reply to this email or contact us at ${EVENT.contactEmail}.
      </p>
    </div>
  `;
}

function donationConfirmationHtml(name: string, amount: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h1 style="color:#1B3A5C;font-family:Georgia,serif;">Thank you for your generosity!</h1>
      <p>Dear ${name},</p>
      <p>Your donation of <strong>${amount}</strong> to the ${EVENT.donationTitle} has been received.</p>
      <p>Your contribution helps fund scholarships, chapter house improvements,
         and leadership development for active brothers.</p>
      <p>A tax receipt has been sent separately if applicable.</p>
      <p style="color:#666;font-size:14px;">
        With gratitude,<br/>${EVENT.contactName}
      </p>
    </div>
  `;
}

// ── Webhook handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_details?.email ?? '';
    const customerName  = session.customer_details?.name  ?? 'Valued Supporter';
    const amountTotal   = `$${((session.amount_total ?? 0) / 100).toFixed(2)}`;
    const type          = session.metadata?.type ?? 'unknown';
    const timestamp     = new Date().toISOString();

    if (type === 'ticket') {
      const ticketId  = session.metadata?.ticketId  ?? '';
      const quantity  = session.metadata?.quantity  ?? '1';

      await logToGoogleSheets({
        timestamp,
        type:       'ticket',
        name:       customerName,
        email:      customerEmail,
        ticketType: ticketId,
        quantity,
        amount:     amountTotal,
        sessionId:  session.id,
      });

      if (customerEmail) {
        await sendConfirmationEmail(
          customerEmail,
          `Your ticket is confirmed — ${EVENT.name}`,
          ticketConfirmationHtml(customerName, ticketId, quantity, amountTotal)
        );
      }
    } else if (type === 'donation') {
      await logToGoogleSheets({
        timestamp,
        type:       'donation',
        name:       customerName,
        email:      customerEmail,
        ticketType: '',
        quantity:   '1',
        amount:     amountTotal,
        sessionId:  session.id,
      });

      if (customerEmail) {
        await sendConfirmationEmail(
          customerEmail,
          `Thank you for your donation — ${EVENT.donationTitle}`,
          donationConfirmationHtml(customerName, amountTotal)
        );
      }
    }

    console.log(`[webhook] Processed ${type} from ${customerEmail} — ${amountTotal}`);
  }

  return NextResponse.json({ received: true });
}
