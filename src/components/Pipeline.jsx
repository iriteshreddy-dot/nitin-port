import React, { useRef } from 'react';

const roles = [
  {
    icon: '🎬', title: 'DIRECTOR', tagline: '"On-set. In control.\nAligned with the vision."',
    skills: ['Set coordination & on-set execution', 'Scene breakdowns & shot planning', 'Continuity support & assistant management', 'DOP, Art, Post team liaison', 'Timing, scheduling & problem solving'],
  },
  {
    icon: '🤖', title: 'AI GENERALIST', tagline: '"Full pipeline. Every stage.\nAccelerated."',
    skills: ['Idea-to-shot workflow & look development', 'Previs & production planning', 'On-set AI tools & rapid frame mockups', 'AI-assisted rough edits & audio cleanup', 'Content packaging & delivery'],
  },
  {
    icon: '✨', title: 'VFX ARTIST', tagline: '"Plates. Compositing.\nPipeline discipline."',
    skills: ['Plate preparation & compositing support', 'Shot consistency — grain, light matching', 'Edge detail & color integration', 'Naming, versioning & delivery standards', 'Pipeline coordination & QC'],
  },
];

export default function Pipeline() {
  const colsRef = useRef([]);

  function activate(idx) {
    colsRef.current.forEach((c, i) => {
      if (!c) return;
      c.classList.toggle('spotlight-active', i === idx);
    });
  }

  return (
    <section id="pipeline" style={{ background: 'var(--bg)', borderTop: '1px solid var(--separator)', paddingBottom: 140 }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>04 — The Pipeline</div>
          <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,7vw,96px)', letterSpacing: '0.05em', color: 'var(--text)', lineHeight: 1 }}>
            THREE<br /><span style={{ color: 'var(--gold)' }}>DISCIPLINES</span>
          </h2>
        </div>

        <div className="pipeline-flex" style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: 0, minHeight: 580 }}>
          {roles.map((role, i) => (
            <React.Fragment key={role.title}>
              <div
                ref={el => colsRef.current[i] = el}
                className={`spotlight-col${i === 0 ? ' spotlight-active' : ''}`}
                onMouseEnter={() => activate(i)}
                onClick={() => activate(i)}
                style={{ flex: 1, maxWidth: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'none', padding: '0 20px' }}
              >
                {/* Beam */}
                <div className="spotlight-beam" />

                <div className="spotlight-circle" style={{
                  width: 90, height: 90, borderRadius: '50%',
                  border: '1px solid rgba(232,213,163,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 28, position: 'relative', zIndex: 2,
                  transition: 'all 0.5s ease', background: 'rgba(255,255,255,0.02)',
                }}>
                  <span className="spotlight-icon" style={{ fontSize: 32, transition: 'filter 0.4s' }}>{role.icon}</span>
                </div>

                <div className="spotlight-role" style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '0.1em', color: 'rgba(245,240,232,0.35)', marginBottom: 10, textAlign: 'center', transition: 'color 0.4s', position: 'relative', zIndex: 2 }}>
                  {role.title}
                </div>

                <div className="spotlight-tagline" style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: 13, textAlign: 'center', lineHeight: 1.5, marginBottom: 20, transition: 'color 0.4s', position: 'relative', zIndex: 2, whiteSpace: 'pre-line' }}>
                  {role.tagline}
                </div>

                <div className="spotlight-card" style={{
                  border: '1px solid var(--separator)', padding: '28px 24px',
                  background: 'rgba(255,255,255,0.01)', width: '100%',
                  transition: 'all 0.5s ease', position: 'relative', zIndex: 2,
                }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {role.skills.map(s => (
                      <li key={s} style={{ fontSize: 12, letterSpacing: '0.05em', color: 'rgba(245,240,232,0.5)', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--gold)', opacity: 0.5, flexShrink: 0 }}>—</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {i < 2 && <div className="pipeline-divider" style={{ width: 1, background: 'var(--separator)', alignSelf: 'stretch', marginTop: 100 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        .spotlight-beam {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 160px; height: 100%;
          background: linear-gradient(180deg, rgba(232,213,163,0.0) 0%, rgba(232,213,163,0.06) 40%, rgba(232,213,163,0.0) 100%);
          clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
          pointer-events: none; opacity: 0; transition: opacity 0.5s ease;
        }
        .spotlight-active .spotlight-beam, .spotlight-col:hover .spotlight-beam { opacity: 1; }
        .spotlight-active .spotlight-circle, .spotlight-col:hover .spotlight-circle {
          border-color: var(--gold) !important;
          background: rgba(232,213,163,0.06) !important;
          box-shadow: 0 0 40px rgba(232,213,163,0.2), inset 0 0 20px rgba(232,213,163,0.05) !important;
        }
        .spotlight-active .spotlight-icon { filter: none !important; }
        .spotlight-col:hover .spotlight-icon { filter: none !important; }
        .spotlight-col .spotlight-icon { filter: grayscale(1); }
        .spotlight-active .spotlight-role, .spotlight-col:hover .spotlight-role { color: var(--text) !important; }
        .spotlight-active .spotlight-tagline, .spotlight-col:hover .spotlight-tagline { color: var(--gold) !important; }
        .spotlight-tagline { color: rgba(232,213,163,0); }
        .spotlight-card { opacity: 0; transform: translateY(16px); }
        .spotlight-active .spotlight-card, .spotlight-col:hover .spotlight-card {
          opacity: 1 !important; transform: translateY(0) !important;
          border-color: rgba(232,213,163,0.15) !important;
          background: rgba(232,213,163,0.025) !important;
        }
        @media (max-width: 768px) {
          .pipeline-flex { flex-direction: column !important; align-items: center !important; gap: 40px !important; min-height: auto !important; }
          .pipeline-divider { display: none !important; }
          .spotlight-col { max-width: 100% !important; width: 100% !important; }
          .spotlight-card { opacity: 1 !important; transform: none !important; border-color: rgba(232,213,163,0.15) !important; background: rgba(232,213,163,0.025) !important; }
          .spotlight-beam { display: none; }
        }
      `}</style>
    </section>
  );
}
