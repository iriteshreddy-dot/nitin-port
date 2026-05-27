import React, { useState, useEffect } from 'react';

const LINKS = ['Reel', 'About', 'Pipeline', 'Credits', 'Contact'];

export default function Nav({ visible }) {
  const [open, setOpen]     = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001,
        padding: mobile ? '18px 24px' : '24px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transition: 'opacity 0.6s ease',
      }}>
        <a href="#hero" style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.1em', color: 'var(--gold)', textDecoration: 'none', zIndex: 1002, position: 'relative' }}>NG</a>

        {/* Desktop links */}
        {!mobile && (
          <ul style={{ display: 'flex', gap: 36, listStyle: 'none' }}>
            {LINKS.map(link => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`}
                  style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', textDecoration: 'none', cursor: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.5)'}
                >{link}</a>
              </li>
            ))}
          </ul>
        )}

        {/* Hamburger button */}
        {mobile && (
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, zIndex: 1002, position: 'relative', display: 'flex', flexDirection: 'column', gap: 5 }}
          >
            <span style={{ display: 'block', width: 24, height: 1.5, background: 'var(--gold)', transition: 'all 0.3s', transform: open ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none' }} />
            <span style={{ display: 'block', width: 24, height: 1.5, background: 'var(--gold)', transition: 'opacity 0.3s', opacity: open ? 0 : 1 }} />
            <span style={{ display: 'block', width: 24, height: 1.5, background: 'var(--gold)', transition: 'all 0.3s', transform: open ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none' }} />
          </button>
        )}
      </nav>

      {/* Mobile full-screen menu */}
      {mobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5,5,5,0.97)',
          backdropFilter: 'blur(24px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.35s ease',
        }}>
          {LINKS.map((link, i) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 11vw, 60px)',
                letterSpacing: '0.1em',
                color: 'rgba(245,240,232,0.8)',
                textDecoration: 'none',
                transform: open ? 'translateY(0)' : 'translateY(24px)',
                opacity: open ? 1 : 0,
                transition: `transform 0.4s ease ${i * 0.07}s, opacity 0.4s ease ${i * 0.07}s`,
              }}
            >{link}</a>
          ))}
        </div>
      )}
    </>
  );
}
