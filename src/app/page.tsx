import Navbar  from '@/components/Navbar';
import Hero    from '@/components/Hero';
import About   from '@/components/About';
import Tickets from '@/components/Tickets';
import Donate  from '@/components/Donate';
import Footer  from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Tickets />
      <Donate />
      <Footer />
    </main>
  );
}
