import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CinemaRoom from './CinemaRoom';

export default function Hero() {
  const sectionRef   = useRef(null);
  const textRef      = useRef(null);
  const scrollHintRef = useRef(null);
  const scrollProgressRef = useRef(0);  // 0–1, read by CinemaRoom each frame

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      // Pin for 1.5× viewport height of scrolling = cinematic runway
      end: () => `+=${window.innerHeight * 1.5}`,
      pin: true,
      scrub: 1.8,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;

        // Fade text out across the first 30% of scroll travel
        const opacity = Math.max(0, 1 - self.progress * 3.3);
        if (textRef.current)      textRef.current.style.opacity      = opacity;
        if (scrollHintRef.current) scrollHintRef.current.style.opacity = opacity;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <CinemaRoom scrollProgressRef={scrollProgressRef} />

      {/* Hero text — fades out as camera zooms */}
      <div
        ref={textRef}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          pointerEvents: 'none',
          transition: 'opacity 0.1s linear',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.6em',
          textTransform: 'uppercase', color: 'rgba(232,213,163,0.5)', marginBottom: 20,
          opacity: 0, animation: 'burnIn 1.2s ease 1s forwards',
        }}>A film by</div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(64px, 11vw, 160px)',
          letterSpacing: '0.08em', lineHeight: 0.9,
          color: 'var(--text)',
          opacity: 0, animation: 'burnIn 1.4s ease 1.4s forwards',
          textShadow: '0 0 120px rgba(232,213,163,0.25), 0 2px 4px rgba(0,0,0,0.9)',
        }}>NITIN GADILA</div>

        <div style={{
          marginTop: 20,
          fontFamily: 'var(--font-accent)', fontStyle: 'italic',
          fontSize: 'clamp(14px, 2vw, 22px)',
          color: 'var(--gold)', letterSpacing: '0.04em',
          opacity: 0, animation: 'burnIn 1.2s ease 2s forwards',
        }}>
          Associate Director
          <span style={{ color: 'rgba(232,213,163,0.4)', margin: '0 10px' }}>·</span>
          AI Generalist
          <span style={{ color: 'rgba(232,213,163,0.4)', margin: '0 10px' }}>·</span>
          VFX Artist
        </div>
      </div>

      {/* Scroll hint — fades out with text */}
      <div
        ref={scrollHintRef}
        style={{
          position: 'absolute', bottom: 40, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          opacity: 0, animation: 'fadeInUp 1s ease 3.5s forwards',
          zIndex: 10, pointerEvents: 'none',
          transition: 'opacity 0.1s linear',
        }}
      >
        <div style={{
          width: 20, height: 20,
          border: '1px solid rgba(232,213,163,0.3)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'spinReel 3s linear infinite',
        }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', opacity: 0.6 }} />
        </div>
        <span style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(232,213,163,0.4)' }}>
          Scroll to enter
        </span>
      </div>

      <style>{`
        @keyframes burnIn {
          from { opacity: 0; filter: brightness(3); }
          to   { opacity: 1; filter: brightness(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes spinReel { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
