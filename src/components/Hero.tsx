import { EVENT } from '@/lib/config';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/*
        Background image — replace the bg-gradient below with an actual image:
          <Image src="/hero-bg.jpg" alt="" fill className="object-cover" priority />
        and keep the overlay div below it.
      */}
      {/* Placeholder gradient background */}
      <div className="absolute inset-0 bg-beta-blue" />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4697C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Dark gradient — bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-beta-blue/30 via-transparent to-beta-dark/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20">
        {/* Gold rule above */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="block h-px w-16 bg-beta-pink/70" />
          <span className="text-beta-pink uppercase text-xs tracking-[0.25em] font-semibold">
            {new Date().getFullYear()} Annual Reunion
          </span>
          <span className="block h-px w-16 bg-beta-pink/70" />
        </div>

        {/* Event name */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
          {EVENT.name}
        </h1>

        {/* Tagline */}
        <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          {EVENT.tagline}
        </p>

        {/* Date / Time / Location badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10">
          <div className="flex items-center gap-2 text-white/90">
            <svg className="w-5 h-5 text-beta-pink flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{EVENT.date}</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <svg className="w-5 h-5 text-beta-pink flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{EVENT.time}</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <svg className="w-5 h-5 text-beta-pink flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">{EVENT.location}</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#tickets" className="btn-primary text-base px-10 py-4 w-full sm:w-auto">
            Get Tickets
          </a>
          <a href="#donate" className="btn-outline text-base px-10 py-4 w-full sm:w-auto">
            Make a Donation
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
