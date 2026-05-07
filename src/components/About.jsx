import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const typeText = `A hybrid creative who understands\nboth art and execution.\n\n2 years as FX Artist — previs,\nshot consistency, pipeline discipline.\n\n2 years as Associate Director —\nset coordination, scene planning,\ncontinuity, on-set execution.\n\nNow: AI Generalist. Accelerating\nthe full production pipeline.`;

const badges = ['Haarika & Hassine', 'Halohues Studio', 'Pixelloid VFX', 'GITAM University', 'B.Tech CSE · 2022'];

export default function About() {
  const typedRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Reveal animations
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });

    // Typewriter
    const el = typedRef.current;
    if (!el) return;
    let i = 0, started = false;
    const cursor = el.querySelector('.typed-cursor');

    function typeNext() {
      if (i >= typeText.length) return;
      const char = typeText[i];
      if (char === '\n') {
        el.insertBefore(document.createElement('br'), cursor);
      } else {
        el.insertBefore(document.createTextNode(char), cursor);
      }
      i++;
      const delay = char === '\n' ? 80 : (char === '.' ? 300 : 28 + Math.random() * 20);
      setTimeout(typeNext, delay);
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          setTimeout(typeNext, 400);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{ background: 'var(--bg2)', borderTop: '1px solid var(--separator)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Screenplay block */}
          <div className="reveal">
            <div style={{
              fontFamily: 'var(--font-script)', fontSize: 14, lineHeight: 1.9,
              color: 'rgba(245,240,232,0.7)', position: 'relative',
              padding: 40, border: '1px solid var(--separator)', background: 'rgba(255,255,255,0.015)',
            }}>
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.018) 27px, rgba(255,255,255,0.018) 28px)',
              }} />
              <div style={{ color: 'var(--text)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 1, height: 40, background: 'var(--gold)', opacity: 0.4, display: 'inline-block', flexShrink: 0 }} />
                INT. STUDIO — CONTINUOUS
              </div>
              <div ref={typedRef} style={{ minHeight: 160, position: 'relative' }}>
                <span className="typed-cursor" style={{ display: 'inline-block', width: 2, height: '1em', background: 'var(--gold)', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="section-label" style={{ color: 'var(--gold)' }}>03 — The Director</div>
            <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,5vw,72px)', letterSpacing: '0.04em', lineHeight: 1, color: 'var(--text)' }}>
              ABOUT<br />NITIN
            </h2>
            <blockquote className="reveal" style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: 18, color: 'var(--gold)', lineHeight: 1.5, paddingLeft: 20, borderLeft: '2px solid rgba(232,213,163,0.3)' }}>
              "A hybrid creative who understands<br />both art and execution."
            </blockquote>
            <p className="reveal" style={{ fontSize: 14, lineHeight: 1.85, color: 'rgba(245,240,232,0.55)' }}>
              2 years as an FX Artist — pre-visualization, shot consistency, VFX pipeline discipline across major Indian productions. Now operating as an Associate Director with a full AI toolkit — accelerating every stage of the production pipeline without sacrificing cinematic quality.
            </p>
            <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
              {badges.map(b => (
                <span key={b} style={{
                  fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                  padding: '7px 14px', border: '1px solid var(--separator)', color: 'rgba(245,240,232,0.4)',
                  background: 'rgba(255,255,255,0.02)', cursor: 'default', transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.target.style.borderColor = 'rgba(232,213,163,0.3)'; e.target.style.color = 'var(--gold)'; e.target.style.background = 'rgba(232,213,163,0.04)'; }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--separator)'; e.target.style.color = 'rgba(245,240,232,0.4)'; e.target.style.background = 'rgba(255,255,255,0.02)'; }}
                >{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </section>
  );
}
