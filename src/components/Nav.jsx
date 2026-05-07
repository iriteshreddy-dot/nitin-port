import React from 'react';

export default function Nav({ visible }) {
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      padding: '24px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'all' : 'none',
      transition: 'opacity 0.6s ease',
    }}>
      <a href="#hero" style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.1em', color: 'var(--gold)', textDecoration: 'none' }}>NG</a>
      <ul style={{ display: 'flex', gap: 36, listStyle: 'none' }}>
        {['Reel', 'About', 'Pipeline', 'Credits', 'Contact'].map(link => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', textDecoration: 'none', cursor: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.5)'}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
