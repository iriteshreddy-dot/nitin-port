import React, { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Loader from './components/Loader';
import Nav from './components/Nav';
import GlobalEffects from './components/GlobalEffects';
import Hero from './components/Hero';
import Reel from './components/Reel';
import About from './components/About';
import Pipeline from './components/Pipeline';
import Credits from './components/Credits';
import Contact from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);
    return () => {
      lenis.destroy();
      gsap.ticker.remove(onTick);
    };
  }, [loading]);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <Nav visible={!loading} />
      <GlobalEffects />
      <main>
        <Hero />
        <Reel />
        <About />
        <Pipeline />
        <Credits />
        <Contact />
      </main>
    </div>
  );
}
