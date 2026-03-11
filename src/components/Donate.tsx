'use client';

import { useState } from 'react';
import { EVENT, formatCents } from '@/lib/config';

export default function Donate() {
  const [selected,     setSelected]     = useState<number | null>(EVENT.donationPresets[1]);
  const [customAmount, setCustomAmount] = useState('');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  // Effective amount in cents
  const effectiveAmountCents: number | null = (() => {
    if (customAmount) {
      const parsed = Math.round(parseFloat(customAmount) * 100);
      return isNaN(parsed) || parsed < 100 ? null : parsed;
    }
    return selected;
  })();

  async function handleDonate() {
    if (!effectiveAmountCents) {
      setError('Please enter a valid donation amount (minimum $1).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/donate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amountInCents: effectiveAmountCents }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start donation.');
      setLoading(false);
    }
  }

  // Progress bar
  const showProgress =
    EVENT.donationGoalInCents > 0 && EVENT.donationRaisedInCents >= 0;
  const progressPct = showProgress
    ? Math.min(100, (EVENT.donationRaisedInCents / EVENT.donationGoalInCents) * 100)
    : 0;

  return (
    <section id="donate" className="py-20 md:py-28 bg-beta-blue">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-beta-pink uppercase text-xs tracking-[0.2em] font-semibold mb-3">
            Give Back
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            {EVENT.donationTitle}
          </h2>
          <span className="block w-16 h-0.5 bg-beta-pink mx-auto mb-6" />
          <p className="text-white/70 text-base max-w-2xl mx-auto leading-relaxed">
            {EVENT.donationBlurb}
          </p>
        </div>

        {/* Fundraising progress */}
        {showProgress && (
          <div className="mb-10 bg-white/5 rounded-sm p-6">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-white font-serif text-2xl font-bold">
                  {formatCents(EVENT.donationRaisedInCents)}
                </p>
                <p className="text-white/50 text-sm">
                  raised of {formatCents(EVENT.donationGoalInCents)} goal
                </p>
              </div>
              <p className="text-beta-pink font-bold text-lg">
                {Math.round(progressPct)}%
              </p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-beta-pink h-3 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Donation card */}
        <div className="bg-white rounded-sm shadow-2xl p-6 md:p-10 max-w-xl mx-auto">

          {/* Preset amounts */}
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Select an amount
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {EVENT.donationPresets.map((cents) => (
              <button
                key={cents}
                onClick={() => {
                  setSelected(cents);
                  setCustomAmount('');
                  setError(null);
                }}
                className={`py-3 text-sm font-bold border-2 rounded-sm transition-all duration-150 ${
                  selected === cents && !customAmount
                    ? 'border-beta-pink bg-beta-pink/10 text-beta-blue'
                    : 'border-gray-200 text-gray-700 hover:border-beta-pink hover:text-beta-blue'
                }`}
              >
                {formatCents(cents)}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="mb-6">
            <label
              htmlFor="custom-amount"
              className="text-sm font-semibold text-gray-500 uppercase tracking-widest block mb-2"
            >
              Or enter a custom amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                $
              </span>
              <input
                id="custom-amount"
                type="number"
                min="1"
                step="1"
                placeholder="Other amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelected(null);
                  setError(null);
                }}
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-sm text-gray-800
                           focus:outline-none focus:border-beta-pink transition-colors
                           placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-sm">
              {error}
            </p>
          )}

          {/* Donate button */}
          <button
            onClick={handleDonate}
            disabled={loading || !effectiveAmountCents}
            className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting…
              </span>
            ) : effectiveAmountCents ? (
              `Donate ${formatCents(effectiveAmountCents)}`
            ) : (
              'Donate'
            )}
          </button>

          <p className="text-center text-gray-400 text-xs mt-4">
            Secure one-time payment via Stripe. No account required.
          </p>
        </div>

        {/* Stat pills */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { value: '60+', label: 'Years of brotherhood' },
            { value: '$50k+', label: 'In scholarships awarded' },
            { value: '200+', label: 'Active alumni donors' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-3xl font-bold text-beta-pink">{stat.value}</p>
              <p className="text-white/60 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
