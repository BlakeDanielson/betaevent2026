import Link from 'next/link';
import { EVENT } from '@/lib/config';

interface PageProps {
  searchParams: { type?: string; session_id?: string };
}

export default function SuccessPage({ searchParams }: PageProps) {
  const type = searchParams.type ?? 'ticket';
  const isDonation = type === 'donation';

  return (
    <main className="min-h-screen bg-beta-cream flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-sm shadow-xl p-8 md:p-12 text-center">

        {/* Icon */}
        <div className="w-16 h-16 bg-beta-pink/15 rounded-full flex items-center justify-center mx-auto mb-6">
          {isDonation ? (
            /* Heart icon */
            <svg className="w-8 h-8 text-beta-pink" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            /* Checkmark icon */
            <svg className="w-8 h-8 text-beta-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Heading */}
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-beta-blue mb-3">
          {isDonation ? 'Thank You for Your Generosity!' : 'You\'re Confirmed!'}
        </h1>

        {/* Divider */}
        <span className="block w-12 h-0.5 bg-beta-pink mx-auto mb-5" />

        {/* Body copy */}
        <p className="text-gray-600 leading-relaxed mb-4">
          {isDonation ? (
            <>
              Your donation to the <strong>{EVENT.donationTitle}</strong> has been received.
              A confirmation and tax receipt will be sent to your email shortly.
            </>
          ) : (
            <>
              Your ticket to <strong>{EVENT.name}</strong> has been confirmed.
              A confirmation email will arrive shortly — please save it for check-in.
            </>
          )}
        </p>

        {!isDonation && (
          <div className="bg-beta-cream rounded-sm px-5 py-4 text-sm text-gray-600 text-left mb-6 space-y-1.5">
            <p className="flex items-center gap-2">
              <span className="text-beta-pink font-bold">📅</span>
              {EVENT.date}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-beta-pink font-bold">🕕</span>
              {EVENT.time} (Doors at {EVENT.doorsOpen})
            </p>
            <p className="flex items-center gap-2">
              <span className="text-beta-pink font-bold">📍</span>
              {EVENT.location}
            </p>
          </div>
        )}

        <p className="text-gray-500 text-sm mb-8">
          Questions? Email us at{' '}
          <a
            href={`mailto:${EVENT.contactEmail}`}
            className="text-beta-pink hover:text-pink-500 transition-colors"
          >
            {EVENT.contactEmail}
          </a>
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 btn-outline text-sm py-3 text-center"
          >
            ← Back to Event
          </Link>
          {!isDonation && (
            <Link
              href="/#donate"
              className="flex-1 btn-primary text-sm py-3 text-center"
            >
              Make a Donation
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
