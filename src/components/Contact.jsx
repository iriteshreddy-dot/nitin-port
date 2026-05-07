import React, { useRef, useEffect, useState } from 'react';

export default function Contact() {
  const sectionRef  = useRef(null);
  const topRef      = useRef(null);
  const [visible, setVisible] = useState(false);

  // Snap animation when section enters viewport
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── CLAPPER TOP ───────────────────────────────────────────── */}
      <div
        ref={topRef}
        style={{
          height: 'clamp(120px, 18vh, 200px)',
          position: 'relative',
          overflow: 'hidden',
          background: 'repeating-linear-gradient(-45deg, #000 0px, #000 30px, #fff 30px, #fff 60px)',
          boxShadow: '0 6px 32px rgba(0,0,0,0.9)',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
          zIndex: 2,
        }}
      >
        {/* Left mount with bolts */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: 72,
          background: '#0a0a0a',
          borderRight: '3px solid #1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          padding: '16px 0',
        }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              width: 20, height: 20,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 35%, #3a3a3a, #0d0d0d)',
              border: '2px solid #2a2a2a',
              boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.08)',
            }}/>
          ))}
        </div>

        {/* Bottom edge shadow line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 4,
          background: 'rgba(0,0,0,0.7)',
        }}/>
      </div>

      {/* ── SLATE BODY ────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(160deg, #0f0f0f 0%, #080808 50%, #111 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(32px, 5vw, 64px) clamp(28px, 7vw, 80px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s',
      }}>

        {/* Section label */}
        <div className="section-label" style={{ marginBottom: 36 }}>06 — The Close</div>

        {/* TITLE field */}
        <div style={{ marginBottom: 32 }}>
          <div style={labelStyle}>TITLE</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 5vw, 64px)',
            letterSpacing: '0.04em',
            color: 'var(--text)',
            lineHeight: 0.95,
            marginTop: 10,
          }}>
            LET'S BUILD SOMETHING<br/>
            <span style={{ color: 'var(--gold)' }}>CINEMATIC.</span>
          </h2>
        </div>

        <Divider/>

        {/* DIRECTOR + CAMERA row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: '22px 0' }}>
          <div>
            <div style={labelStyle}>DIRECTOR</div>
            <div style={valueStyle}>Nitin Gadila</div>
          </div>
          <div>
            <div style={labelStyle}>CAMERA</div>
            <div style={{ ...valueStyle, fontSize: 'clamp(13px, 1.6vw, 18px)', lineHeight: 1.5 }}>
              Associate Director<br/>
              AI Generalist · VFX Artist
            </div>
          </div>
        </div>

        <Divider/>

        {/* CONTACT field */}
        <div style={{ padding: '22px 0' }}>
          <div style={labelStyle}>CONTACT</div>
          <a
            href="mailto:contact@nitingadila.com"
            style={{
              display: 'block',
              marginTop: 10,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(18px, 2.5vw, 30px)',
              color: 'var(--gold)',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              cursor: 'none',
            }}
          >
            contact@nitingadila.com
          </a>

          {/* Social links */}
          <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
            {[
              { label: 'LinkedIn',  href: 'https://linkedin.com/in/nitingadila' },
              { label: 'Instagram', href: 'https://instagram.com/nitingadila' },
              { label: 'Phone',     href: 'tel:+91XXXXXXXXXX' },
            ].map(l => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  padding: '10px 22px',
                  border: '1px solid rgba(232,213,163,0.2)',
                  color: 'rgba(245,240,232,0.55)',
                  textDecoration: 'none',
                  cursor: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.color='var(--gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(232,213,163,0.2)'; e.currentTarget.style.color='rgba(245,240,232,0.55)'; }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <Divider thick/>

        {/* DATE | SCENE | TAKE bottom row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          marginBottom: 36,
        }}>
          {[
            { label: 'DATE',  value: '2025' },
            { label: 'SCENE', value: 'Contact', border: true },
            { label: 'TAKE',  value: '01' },
          ].map(f => (
            <div
              key={f.label}
              style={{
                padding: '14px 0',
                borderLeft: f.border ? '1px solid rgba(255,255,255,0.18)' : 'none',
                borderRight: f.border ? '1px solid rgba(255,255,255,0.18)' : 'none',
                paddingLeft: f.border ? 20 : 0,
                paddingRight: f.border ? 20 : 0,
              }}
            >
              <div style={labelStyle}>{f.label}</div>
              <div style={{ ...valueStyle, fontSize: 20, marginTop: 4 }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 'auto' }}>
          <a
            href="mailto:contact@nitingadila.com"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              letterSpacing: '0.2em',
              padding: '18px 60px',
              background: 'var(--gold)',
              color: '#000',
              textDecoration: 'none',
              cursor: 'none',
              transition: 'all 0.3s ease',
              border: '2px solid var(--gold)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--gold)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(232,213,163,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--gold)';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            [ LET'S COLLABORATE ]
          </a>

          <div style={{
            marginTop: 32,
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            letterSpacing: '0.2em',
            color: 'rgba(245,240,232,0.12)',
            textTransform: 'uppercase',
          }}>
            Indian Film Industry · Available for Projects
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const labelStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.38)',
};

const valueStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(18px, 2.2vw, 26px)',
  letterSpacing: '0.06em',
  color: 'var(--text)',
  marginTop: 6,
};

function Divider({ thick = false }) {
  return (
    <div style={{
      width: '100%',
      height: thick ? 2 : 1,
      background: thick ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
    }}/>
  );
}
