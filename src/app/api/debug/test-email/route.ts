/**
 * Protected test endpoint — sends a sample confirmation email so you can
 * verify the Resend pipeline end-to-end without running a real Stripe
 * checkout. Disabled unless DEBUG_TEST_SECRET is set.
 *
 * Usage:
 *   GET /api/debug/test-email
 *     ?secret=<DEBUG_TEST_SECRET>
 *     &to=you@example.com
 *     &type=ticket|donation        (default: ticket)
 *     &name=Jane%20Doe             (optional)
 *     &phone=+15551234567          (optional, ticket only)
 *
 * The endpoint calls Resend directly and returns the SDK's { data, error }
 * response so you can see exactly what happened (e.g. unverified-domain 403s).
 */

import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { EVENT } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const configuredSecret = process.env.DEBUG_TEST_SECRET;

  if (!configuredSecret) {
    return NextResponse.json(
      { error: 'Test endpoint disabled. Set DEBUG_TEST_SECRET in your environment to enable it.' },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(req.url);
  const providedSecret = searchParams.get('secret') ?? '';
  if (providedSecret !== configuredSecret) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const to    = searchParams.get('to');
  const type  = (searchParams.get('type') ?? 'ticket') as 'ticket' | 'donation';
  const name  = searchParams.get('name')  ?? 'Test Recipient';
  const phone = searchParams.get('phone') ?? '+1 (555) 123-4567';

  if (!to || !/.+@.+\..+/.test(to)) {
    return NextResponse.json(
      { error: 'Missing or invalid "to" query parameter.' },
      { status: 400 }
    );
  }

  if (!resend) {
    return NextResponse.json(
      { error: 'Resend not initialized. Set RESEND_API_KEY.' },
      { status: 500 }
    );
  }
  if (!process.env.RESEND_FROM_EMAIL) {
    return NextResponse.json(
      { error: 'RESEND_FROM_EMAIL is not set.' },
      { status: 500 }
    );
  }

  const subject =
    type === 'donation'
      ? `[TEST] Thank you for your donation — ${EVENT.donationTitle}`
      : `[TEST] Your ticket is confirmed — ${EVENT.name}`;

  const html =
    type === 'donation'
      ? donationHtml(name, '$100.00')
      : ticketHtml(name, EVENT.tickets[0]?.name ?? 'General Admission', '2', '$150.00', phone);

  const result = await resend.emails.send({
    from:    `${EVENT.orgName} <${process.env.RESEND_FROM_EMAIL}>`,
    to,
    bcc:     EVENT.contactEmail ? [EVENT.contactEmail] : undefined,
    subject,
    html,
    replyTo: EVENT.contactEmail || undefined,
  });

  if (result.error) {
    return NextResponse.json(
      {
        ok:    false,
        from:  process.env.RESEND_FROM_EMAIL,
        to,
        type,
        error: result.error,
        hint:  result.error.message?.includes('own email address')
          ? 'You are sending from onboarding@resend.dev, which can only deliver to the Resend account owner. Verify a domain at https://resend.com/domains and update RESEND_FROM_EMAIL.'
          : undefined,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok:    true,
    from:  process.env.RESEND_FROM_EMAIL,
    to,
    type,
    id:    result.data?.id,
    note:  'If you don\'t see the email, check spam and check the Resend dashboard logs.',
  });
}

function ticketHtml(
  name: string,
  ticketType: string,
  quantity: string,
  amount: string,
  phone: string
) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <div style="background:#fff3cd;border:1px solid #ffeeba;color:#856404;padding:8px 12px;margin-bottom:16px;font-size:12px;">
        This is a TEST email sent from /api/debug/test-email.
      </div>
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
        <tr><td style="padding:8px 0;font-weight:bold;">Phone on file:</td>
            <td style="padding:8px 0;">${phone}</td></tr>
      </table>
      <p style="color:#666;font-size:14px;">
        Questions? Reply to this email or contact us at ${EVENT.contactEmail}.
      </p>
    </div>
  `;
}

function donationHtml(name: string, amount: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <div style="background:#fff3cd;border:1px solid #ffeeba;color:#856404;padding:8px 12px;margin-bottom:16px;font-size:12px;">
        This is a TEST email sent from /api/debug/test-email.
      </div>
      <h1 style="color:#1B3A5C;font-family:Georgia,serif;">Thank you for your generosity!</h1>
      <p>Dear ${name},</p>
      <p>Your donation of <strong>${amount}</strong> to the ${EVENT.donationTitle} has been received.</p>
      <p style="color:#666;font-size:14px;">With gratitude,<br/>${EVENT.contactName}</p>
    </div>
  `;
}
