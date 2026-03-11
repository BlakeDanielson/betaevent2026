import Image from 'next/image';
import { EVENT } from '@/lib/config';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-beta-dark text-white">

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid md:grid-cols-3 gap-10">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image src="/crest.svg" alt="Crest" fill className="object-contain" />
              </div>
              <span className="font-serif text-base font-semibold leading-tight">
                {EVENT.orgName}
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              {EVENT.tagline}
            </p>
            <p className="text-white/30 text-xs mt-4">
              Est. {EVENT.foundedYear}
            </p>
          </div>

          {/* Event info column */}
          <div>
            <h4 className="font-serif text-base font-bold mb-4 text-beta-pink">
              {EVENT.name}
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>{EVENT.date}</li>
              <li>{EVENT.time}</li>
              <li>{EVENT.location}</li>
              <li>{EVENT.address}</li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a href="#tickets" className="btn-primary text-xs py-2 px-4">
                Get Tickets
              </a>
              <a href="#donate" className="btn-outline text-xs py-2 px-4">
                Donate
              </a>
            </div>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="font-serif text-base font-bold mb-4 text-beta-pink">
              Contact
            </h4>
            <p className="text-white/60 text-sm mb-2">{EVENT.contactName}</p>
            <a
              href={`mailto:${EVENT.contactEmail}`}
              className="text-beta-pink hover:text-pink-400 text-sm transition-colors break-all"
            >
              {EVENT.contactEmail}
            </a>

            {/* Social links */}
            <div className="flex gap-4 mt-6">
              {EVENT.social.instagram && (
                <SocialLink href={EVENT.social.instagram} label="Instagram">
                  {/* Instagram icon */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </SocialLink>
              )}
              {EVENT.social.facebook && (
                <SocialLink href={EVENT.social.facebook} label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </SocialLink>
              )}
              {EVENT.social.linkedin && (
                <SocialLink href={EVENT.social.linkedin} label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </SocialLink>
              )}
              {EVENT.social.twitter && (
                <SocialLink href={EVENT.social.twitter} label="Twitter/X">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </SocialLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <p>
            © {year} {EVENT.orgFullName}. All rights reserved.
          </p>
          <p>
            Secure payments via{' '}
            <span className="text-white/50">Stripe</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-white/40 hover:text-beta-pink transition-colors duration-150"
    >
      {children}
    </a>
  );
}
