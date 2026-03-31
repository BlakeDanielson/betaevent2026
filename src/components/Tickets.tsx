'use client';

import { useState } from 'react';
import { EVENT, formatCents } from '@/lib/config';

type TicketId = typeof EVENT.tickets[number]['id'];

export default function Tickets() {
  const [quantities,  setQuantities]  = useState<Record<TicketId, number>>(
    Object.fromEntries(EVENT.tickets.map((t) => [t.id, 1]))
  );
  const [loadingId,   setLoadingId]   = useState<TicketId | null>(null);
  const [error,       setError]       = useState<string | null>(null);

  function updateQty(id: TicketId, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min(10, Math.max(1, (prev[id] ?? 1) + delta)),
    }));
  }

  async function handleBuy(ticketId: TicketId) {
    setLoadingId(ticketId);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ticketId, quantity: quantities[ticketId] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout.');
      setLoadingId(null);
    }
  }

  return (
    <section id="tickets" className="py-20 md:py-28 bg-beta-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-beta-pink uppercase text-xs tracking-[0.2em] font-semibold mb-3">
            Reserve Your Seat
          </p>
          <h2 className="section-heading">Tickets</h2>
          <span className="accent-divider" />
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            Select the ticket tier that suits you. All tiers include dinner and open bar.
            Limited availability — reserve early.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-8 max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm text-center">
            {error}
          </div>
        )}

        {/* Ticket cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {EVENT.tickets.map((tier) => {
            const isVip     = tier.badge === 'Most Popular';
            const isLoading = loadingId === tier.id;

            return (
              <div
                key={tier.id}
                className={`card flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  tier.badge ? 'relative' : ''
                } ${
                  isVip ? 'ring-2 ring-beta-pink' : ''
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-beta-pink text-beta-dark text-xs font-bold px-4 py-1 uppercase tracking-wider shadow-sm">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className={`p-6 md:p-7 flex flex-col flex-1 ${tier.badge ? 'pt-8' : ''}`}>

                  {/* Header */}
                  <div className="mb-5">
                    <h3 className="font-serif text-xl font-bold text-beta-blue mb-1">
                      {tier.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-snug">{tier.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-beta-blue font-serif">
                      {formatCents(tier.priceInCents)}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">/ {tier.unit ?? 'person'}</span>
                  </div>

                  {/* Perks */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <svg
                          className="w-4 h-4 text-beta-pink mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {perk}
                      </li>
                    ))}
                  </ul>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm text-gray-500 font-medium">Qty:</span>
                    <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden">
                      <button
                        onClick={() => updateQty(tier.id, -1)}
                        disabled={quantities[tier.id] <= 1}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors text-base font-medium"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-4 py-1.5 text-sm font-semibold text-beta-dark border-x border-gray-200 min-w-[2.5rem] text-center">
                        {quantities[tier.id]}
                      </span>
                      <button
                        onClick={() => updateQty(tier.id, +1)}
                        disabled={quantities[tier.id] >= 10}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors text-base font-medium"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatCents(tier.priceInCents * quantities[tier.id])} total
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleBuy(tier.id)}
                    disabled={isLoading || !tier.available}
                    className={`w-full py-3 font-semibold text-sm tracking-wide transition-all duration-200 ${
                      isVip
                        ? 'btn-primary'
                        : 'bg-beta-blue text-white hover:bg-beta-blue/90 focus:ring-2 focus:ring-beta-blue'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Redirecting…
                      </span>
                    ) : tier.available ? (
                      'Buy Now →'
                    ) : (
                      'Sold Out'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          Secure checkout powered by Stripe. All major credit cards accepted.
        </p>
      </div>
    </section>
  );
}
