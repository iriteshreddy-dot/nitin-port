import React from 'react';

function Rule() {
  return <div style={{ width: 180, height: 1, background: 'linear-gradient(90deg, transparent, rgba(232,213,163,0.25), transparent)', margin: '48px auto' }} />;
}

export default function Credits() {
  return (
    <section id="credits" style={{ background: '#000', borderTop: '1px solid var(--separator)', padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

        {/* Gradient masks */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(180deg, #000 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(0deg, #000 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }} />

        <div style={{
          position: 'relative', zIndex: 5, textAlign: 'center',
          animation: 'creditsScroll 28s linear infinite',
        }} className="credits-scroll">

          <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 24 }}>A Portfolio Presentation</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,3vw,32px)', letterSpacing: '0.3em', color: 'var(--text)', marginBottom: 40 }}>— NITIN GADILA —</div>

          <Rule />

          <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 24 }}>Work Experience</div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '0.12em', color: 'var(--text)', marginBottom: 8 }}>ASSOCIATE DIRECTOR</div>
            <div style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: 16, color: 'var(--gold)', marginBottom: 4 }}>Haarika &amp; Hassine Creations</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(245,240,232,0.3)', letterSpacing: '0.1em' }}>May 2025 — Present</div>
          </div>

          <Rule />

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '0.12em', color: 'var(--text)', marginBottom: 8 }}>FX ARTIST</div>
            <div style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: 16, color: 'var(--gold)', marginBottom: 4 }}>Halohues Studio</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(245,240,232,0.3)', letterSpacing: '0.1em' }}>2023 — 2025</div>
          </div>

          <Rule />

          <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 24 }}>Education</div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3vw,40px)', letterSpacing: '0.12em', color: 'var(--text)', marginBottom: 8 }}>VFX TRAINING</div>
            <div style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: 16, color: 'var(--gold)', marginBottom: 4 }}>Pixelloid Studios</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(245,240,232,0.3)', letterSpacing: '0.1em' }}>2023</div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px,2.5vw,32px)', letterSpacing: '0.12em', color: 'var(--text)', marginBottom: 8 }}>B.TECH, COMPUTER SCIENCE</div>
            <div style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: 16, color: 'var(--gold)', marginBottom: 4 }}>GITAM University</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(245,240,232,0.3)', letterSpacing: '0.1em' }}>2022</div>
          </div>

          <Rule />

          <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 24 }}>Featured Projects</div>
          {['Pushpa 2: The Rule', 'Martin', 'HIT: The Third Case', 'Thug Life'].map(p => (
            <div key={p} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3vw,36px)', letterSpacing: '0.08em', color: 'rgba(245,240,232,0.55)', marginBottom: 4 }}>{p}</div>
          ))}

          <Rule />

          <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 16 }}>Skills</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 2.2, color: 'rgba(245,240,232,0.4)' }}>
            Three.js · GSAP · After Effects · DaVinci Resolve<br />
            Houdini FX · Nuke · Blender · AI Production Tools<br />
            Set Direction · Previs · Pipeline Coordination
          </div>

          <Rule />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.3em', color: 'rgba(245,240,232,0.15)', textTransform: 'uppercase' }}>PORTFOLIO 2025 · ALL RIGHTS RESERVED</div>
          <div style={{ height: 80 }} />
        </div>
      </div>

      <style>{`
        @keyframes creditsScroll {
          0%   { transform: translateY(60vh); }
          100% { transform: translateY(-100%); }
        }
        .credits-scroll:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
}
