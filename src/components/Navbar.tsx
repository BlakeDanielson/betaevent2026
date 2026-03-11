'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { EVENT } from '@/lib/config';

const links = [
  { href: '#about',   label: 'About' },
  { href: '#tickets', label: 'Tickets' },
  { href: '#donate',  label: 'Donate' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-beta-blue/95 backdrop-blur-sm shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo / Name */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 relative flex-shrink-0">
              <Image
                src="/crest.svg"
                alt={`${EVENT.orgName} crest`}
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-serif text-white text-sm md:text-base font-semibold leading-tight hidden sm:block">
              {EVENT.orgName}
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-beta-pink text-sm font-medium tracking-wide transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#tickets"
              className="btn-primary text-sm py-2 px-5"
            >
              Get Tickets
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-beta-blue border-t border-white/10">
          <div className="px-4 py-4 flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-beta-pink text-base font-medium py-1 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#tickets"
              className="btn-primary text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Get Tickets
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
