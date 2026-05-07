import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const projects = [
  { title: 'Pushpa 2\nThe Rule', role: 'VFX', studio: 'Haarika & Hassine Creations', bg: 'linear-gradient(135deg,#1a1208,#2a1a06)', border: '#2a2010', offset: false },
  { title: 'Martin',            role: 'VFX', studio: 'Halohues Studio',              bg: 'linear-gradient(135deg,#080d1a,#0d1525)', border: '#10182a', offset: true  },
  { title: 'HIT: The\nThird Case', role: 'VFX', studio: 'Halohues Studio',           bg: 'linear-gradient(135deg,#0a0a0a,#141414)', border: '#1e1e1e', offset: false },
  { title: 'Thug Life',         role: 'VFX', studio: 'Production House',             bg: 'linear-gradient(135deg,#0d0804,#1a1006)', border: '#2a1800', offset: true  },
];

export default function Reel() {
  const framesRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    framesRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0,
        duration: 0.9, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
  }, []);

  return (
    <section id="reel" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>02 — The Reel</div>
          <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,7vw,96px)', letterSpacing: '0.05em', color: 'var(--text)', lineHeight: 1 }}>
            THE <span style={{ color: 'var(--gold)' }}>WORK</span>
          </h2>
        </div>

        {/* Showreel frame */}
        <div className="reveal" style={{
          position: 'relative', width: '100%', maxWidth: 900, margin: '0 auto 80px',
          aspectRatio: '16/9', border: '1px solid rgba(232,213,163,0.15)', overflow: 'hidden',
          boxShadow: '0 0 80px rgba(232,213,163,0.08), 0 0 200px rgba(232,213,163,0.04)',
        }}>
          {/* Film strip top/bottom */}
          {['top', 'bottom'].map(pos => (
            <div key={pos} style={{
              position: 'absolute', [pos]: 0, left: 0, right: 0, height: 6, zIndex: 3,
              background: 'repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(232,213,163,0.15) 18px, rgba(232,213,163,0.15) 20px)',
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(8,8,8,0.6) 100%)',
            zIndex: 2, pointerEvents: 'none',
          }} />
          <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div className="play-btn" style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none', background: 'rgba(232,213,163,0.05)', transition: 'all 0.3s ease' }}>
              <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, fill: 'var(--gold)', marginLeft: 4 }}>
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </div>
            <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)' }}>Showreel 2025</p>
          </div>
        </div>

        {/* Projects grid */}
        <div className="section-label reveal" style={{ marginBottom: 32 }}>Featured Projects</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 48 }}>
          {projects.map((p, i) => (
            <div
              key={i}
              ref={el => framesRef.current[i] = el}
              className="project-frame"
              data-tilt
              style={{ marginTop: p.offset ? 32 : 0, opacity: 0 }}
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                e.currentTarget.style.transform = `translateY(-6px) perspective(400px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transition = 'transform 0.5s ease, border-color 0.4s ease';
                e.currentTarget.style.transform = `translateY(${p.offset ? '-6px' : '0'})`;
                setTimeout(() => { if (e.currentTarget) e.currentTarget.style.transition = ''; }, 500);
              }}
            >
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(160deg, #141414, #0a0a0a)' }}>
                <div style={{ width: '60%', height: '70%', background: p.bg, border: `1px solid ${p.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase' }}>Poster</span>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px', zIndex: 3, transform: 'translateY(8px)', transition: 'transform 0.4s ease' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.06em', color: 'var(--text)', lineHeight: 1.1, textTransform: 'uppercase', whiteSpace: 'pre-line' }}>{p.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: 4 }}>{p.role}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(245,240,232,0.3)', marginTop: 2, letterSpacing: '0.1em' }}>{p.studio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .project-frame {
          position: relative; aspect-ratio: 2/3; overflow: hidden;
          border: 1px solid rgba(232,213,163,0.1); cursor: none;
          transition: border-color 0.4s ease, transform 0.4s ease; background: #111;
        }
        .project-frame::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(8,8,8,0.95) 100%);
          z-index: 2; transition: opacity 0.4s ease;
        }
        .project-frame:hover { border-color: rgba(232,213,163,0.5); box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(232,213,163,0.1); }
        .project-frame:hover .project-title { text-shadow: 1.5px 0 rgba(193,68,14,0.5), -1.5px 0 rgba(0,150,200,0.3); }
        .project-frame:hover > div:last-child { transform: translateY(0) !important; }
        @media (max-width: 900px) {
          .project-frame-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
