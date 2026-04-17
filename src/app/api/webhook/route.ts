import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { resend } from '@/lib/resend';
import { EVENT } from '@/lib/config';

// ── Google Sheets logging (optional) ────────────────────────────────────────
async function logToGoogleSheets(row: Record<string, string>) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url || url.includes('REPLACE_ME')) return;

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
/**
 * Send a transactional email via Resend. Returns true on success, false on
 * failure. Failures are logged with enough detail to diagnose in production.
 */
async function sendConfirmationEmail(
  toEmail: string,
  subject: string,
  htmlBody: string,
  context: Record<string, string> = {}
): Promise<boolean> {
  if (!resend) {
    console.error('[webhook] Resend not initialized — RESEND_API_KEY missing.', context);
    return false;
  }
  if (!process.env.RESEND_FROM_EMAIL) {
    console.error('[webhook] RESEND_FROM_EMAIL not set — cannot send email.', context);
    return false;
  }
  if (!toEmail) {
    console.error('[webhook] No recipient email address.', context);
    return false;
  }

  try {
    // BCC the organizer so there's always a record of the send, even if the
    // buyer's inbox rejects or filters the message.
    const bcc = EVENT.contactEmail ? [EVENT.contactEmail] : undefined;

    const result = await resend.emails.send({
      from:    `${EVENT.orgName} <${process.env.RESEND_FROM_EMAIL}>`,
      to:      toEmail,
      bcc,
      subject,
      html:    htmlBody,
      replyTo: EVENT.contactEmail || undefined,
    });

    // The Resend SDK returns `{ data, error }` — a non-null `error` means the
    // API rejected the send (e.g. unverified domain, invalid recipient). We
    // need to inspect it explicitly; it does NOT throw.
    if (result.error) {
      console.error('[webhook] Resend returned error:', result.error, context);
      return false;
    }

    console.log('[webhook] Email sent', { id: result.data?.id, to: toEmail, ...context });
    return true;
  } catch (err) {
    console.error('[webhook] Email send threw:', err, context);
    return false;
  }
}

/**
 * Last-ditch alert to the organizer when we couldn't deliver to the buyer
 * (missing email, Resend failure, etc.). Keeps purchase records from being lost.
 */
async function notifyOrganizerOfFailure(details: Record<string, string>) {
  if (!EVENT.contactEmail) return;

  const rows = Object.entries(details)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">${k}</td><td style="padding:4px 0;">${v || '—'}</td></tr>`)
    .join('');

  await sendConfirmationEmail(
    EVENT.contactEmail,
    `[Action needed] Could not email buyer — ${EVENT.name}`,
    `<div style="font-family:sans-serif;max-width:600px;">
       <p>A Stripe purchase completed but the confirmation email to the buyer could not be sent.
          Please follow up manually.</p>
       <table style="border-collapse:collapse;">${rows}</table>
     </div>`,
    { reason: 'organizer_fallback' }
  );
}

function ticketConfirmationHtml(
  name: string,
  ticketType: string,
  quantity: string,
  amount: string,
  phone: string
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
        <tr><td style="padding:8px 0;font-weight:bold;">Location:</td>
            <td style="padding:8px 0;">${EVENT.location}<br/>${EVENT.address}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;">Ticket:</td>
            <td style="padding:8px 0;">${ticketType}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;">Qty:</td>
            <td style="padding:8px 0;">${quantity}</td></tr>
        <tr><td style="padding:8px 0;font-weight:bold;">Total:</td>
            <td style="padding:8px 0;">${amount}</td></tr>
        ${phone ? `<tr><td style="padding:8px 0;font-weight:bold;">Phone on file:</td>
            <td style="padding:8px 0;">${phone}</td></tr>` : ''}
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
    const customerPhone = session.customer_details?.phone ?? '';
    const amountTotal   = `$${((session.amount_total ?? 0) / 100).toFixed(2)}`;
    const type          = session.metadata?.type ?? 'unknown';
    const timestamp     = new Date().toISOString();

    if (type === 'ticket') {
      const ticketId   = session.metadata?.ticketId  ?? '';
      const quantity   = session.metadata?.quantity  ?? '1';
      const tier       = EVENT.tickets.find((t) => t.id === ticketId);
      const ticketName = tier?.name ?? ticketId;

      await logToGoogleSheets({
        timestamp,
        type:       'ticket',
        name:       customerName,
        email:      customerEmail,
        phone:      customerPhone,
        ticketType: ticketName,
        quantity,
        amount:     amountTotal,
        sessionId:  session.id,
      });

      const sent = customerEmail
        ? await sendConfirmationEmail(
            customerEmail,
            `Your ticket is confirmed — ${EVENT.name}`,
            ticketConfirmationHtml(customerName, ticketName, quantity, amountTotal, customerPhone),
            { type: 'ticket', sessionId: session.id }
          )
        : false;

      if (!sent) {
        await notifyOrganizerOfFailure({
          Type:     'Ticket',
          Name:     customerName,
          Email:    customerEmail,
          Phone:    customerPhone,
          Ticket:   ticketName,
          Quantity: quantity,
          Amount:   amountTotal,
          Session:  session.id,
        });
      }
    } else if (type === 'donation') {
      await logToGoogleSheets({
        timestamp,
        type:       'donation',
        name:       customerName,
        email:      customerEmail,
        phone:      customerPhone,
        ticketType: '',
        quantity:   '1',
        amount:     amountTotal,
        sessionId:  session.id,
      });

      const sent = customerEmail
        ? await sendConfirmationEmail(
            customerEmail,
            `Thank you for your donation — ${EVENT.donationTitle}`,
            donationConfirmationHtml(customerName, amountTotal),
            { type: 'donation', sessionId: session.id }
          )
        : false;

      if (!sent) {
        await notifyOrganizerOfFailure({
          Type:    'Donation',
          Name:    customerName,
          Email:   customerEmail,
          Phone:   customerPhone,
          Amount:  amountTotal,
          Session: session.id,
        });
      }
    }

    console.log(`[webhook] Processed ${type} from ${customerEmail || '(no email)'} — ${amountTotal}`);
  }

  return NextResponse.json({ received: true });
}
