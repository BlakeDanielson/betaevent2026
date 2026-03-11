import { EVENT } from '@/lib/config';

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-beta-pink uppercase text-xs tracking-[0.2em] font-semibold mb-3">
            The Evening
          </p>
          <h2 className="section-heading">About the Event</h2>
          <span className="accent-divider" />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {EVENT.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Event details column */}
          <div>
            <h3 className="font-serif text-xl font-bold text-beta-blue mb-6">
              Event Details
            </h3>
            <dl className="space-y-4">
              {[
                {
                  label: 'Date',
                  value: EVENT.date,
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  ),
                },
                {
                  label: 'Time',
                  value: `${EVENT.time} (Doors open at ${EVENT.doorsOpen})`,
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                },
                {
                  label: 'Venue',
                  value: EVENT.location,
                  icon: (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  ),
                },
                {
                  label: 'Address',
                  value: EVENT.address,
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M3 10l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
                  ),
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-9 h-9 bg-beta-blue/5 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-beta-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-0.5">
                      {item.label}
                    </dt>
                    <dd className="text-gray-800 font-medium">{item.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Agenda column */}
          <div>
            <h3 className="font-serif text-xl font-bold text-beta-blue mb-6">
              Evening Schedule
            </h3>
            <ol className="relative border-l-2 border-beta-pink/30 space-y-0">
              {EVENT.agenda.map((item, idx) => (
                <li key={idx} className="ml-6 pb-7 last:pb-0">
                  {/* Dot on the timeline */}
                  <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 bg-beta-pink rounded-full ring-4 ring-white" />
                  <time className="block text-xs uppercase tracking-widest text-beta-pink font-semibold mb-1">
                    {item.time}
                  </time>
                  <p className="text-gray-700 font-medium">{item.item}</p>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </section>
  );
}
