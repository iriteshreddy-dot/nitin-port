import React, { useRef, useState, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ── Project data ──────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: '01',
    lines: ['PUSHPA 2:', 'THE RULE'],
    role: 'FX Artist',
    studio: 'Haarika & Hassine Creations',
    year: '2024',
    tags: ['FX Simulation', 'Houdini', 'Pyro', 'Crowd FX'],
    description:
      'Large-scale fire, smoke and crowd FX for one of the highest-grossing Indian films of all time. 200+ shots across a 6-month pipeline.',
    accent: '#C1440E',
    image: '/pushpa2.jpg',
    visualBg: 'radial-gradient(ellipse at 30% 50%, #2a0a00 0%, #0e0400 60%, #060200 100%)',
  },
  {
    id: '02',
    lines: ['MARTIN'],
    role: 'FX Artist',
    studio: 'Halohues Studio',
    year: '2024',
    tags: ['Destruction FX', 'Houdini', 'Nuke', 'Compositing'],
    description:
      'High-impact destruction and environmental FX for this Malayalam action thriller. Tight integration with practical photography.',
    accent: '#3a6ea8',
    image: '/martin.jpg',
    visualBg: 'radial-gradient(ellipse at 30% 50%, #001428 0%, #00070e 60%, #000305 100%)',
  },
  {
    id: '03',
    lines: ['HIT:', 'THE THIRD CASE'],
    role: 'FX Artist',
    studio: 'Halohues Studio',
    year: '2024',
    tags: ['Atmospheric FX', 'Rain Systems', 'Volumes', 'After Effects'],
    description:
      'Atmospheric and procedural FX for this crime thriller — rain systems, smoke volumes, and set-extension compositing across key sequences.',
    accent: '#8a7030',
    image: '/hit.jpg',
    visualBg: 'radial-gradient(ellipse at 30% 50%, #1a1400 0%, #0a0900 60%, #040300 100%)',
  },
  {
    id: '04',
    lines: ['THUG LIFE'],
    role: 'Associate Director',
    studio: 'Haarika & Hassine Creations',
    year: '2025',
    tags: ['Set Direction', 'Previs', 'AI Production', 'Coordination'],
    description:
      'On-set coordination and pre-visualization for this major Pan-Indian production — first feature as Associate Director.',
    accent: '#7a40a8',
    image: '/thuglife.jpg',
    visualBg: 'radial-gradient(ellipse at 30% 50%, #0e0020 0%, #060010 60%, #020008 100%)',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function SelectedWork() {
  const [displayIdx, setDisplayIdx] = useState(0);
  const animatingRef  = useRef(false);
  const currentRef    = useRef(0);
  const touchStartX   = useRef(null);

  // DOM refs — mutated directly to avoid React re-renders during animation
  const sectionRef    = useRef(null);
  const headerRef     = useRef(null);
  const numRef        = useRef(null);     // big watermark number
  const lineWrapRefs  = useRef([]);       // overflow:hidden wrappers for each title line
  const lineInnerRefs = useRef([]);       // inner divs that translateY
  const dividerRef    = useRef(null);
  const metaRef       = useRef(null);
  const tagsRef       = useRef(null);
  const descRef       = useRef(null);
  const viewRef       = useRef(null);
  const visualRef     = useRef(null);
  const visualBgRef   = useRef(null);
  const visualGlowRef = useRef(null);
  const visualImgRef  = useRef(null);
  const counterRef    = useRef(null);

  // Make sure line refs arrays are big enough
  const MAX_LINES = 2;
  if (lineWrapRefs.current.length < MAX_LINES) lineWrapRefs.current = Array(MAX_LINES).fill(null);
  if (lineInnerRefs.current.length < MAX_LINES) lineInnerRefs.current = Array(MAX_LINES).fill(null);

  // ── Initial entrance ──────────────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const p = PROJECTS[0];

    // Set initial state hidden — ready for entrance
    const inners = lineInnerRefs.current.filter(Boolean);
    gsap.set(inners, { y: '110%' });
    gsap.set([dividerRef.current, metaRef.current, tagsRef.current, descRef.current, viewRef.current], { opacity: 0, y: 18 });
    gsap.set(visualRef.current, { clipPath: 'inset(0 100% 0 0)' });
    gsap.set(numRef.current, { opacity: 0 });
    gsap.set(headerRef.current, { opacity: 0, y: 12 });

    // Play entrance when section scrolls into view
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => playIn(p, 0),
    });
  }, []); // eslint-disable-line

  // ── Animate content IN ────────────────────────────────────────────────────
  function playIn(project, lineCount) {
    const activeInners = lineInnerRefs.current.slice(0, lineCount || project.lines.length).filter(Boolean);

    const tl = gsap.timeline();
    tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0)
      .to(numRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.1)
      .to(visualRef.current, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.85,
        ease: 'power3.inOut',
      }, 0.15)
      .to(activeInners, {
        y: 0,
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out',
      }, 0.3)
      .to(dividerRef.current, { opacity: 1, y: 0, scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.7)
      .to([metaRef.current, tagsRef.current, descRef.current, viewRef.current], {
        opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.07,
      }, 0.8);
  }

  // ── Navigate ──────────────────────────────────────────────────────────────
  const navigate = useCallback((dir) => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const prev     = currentRef.current;
    const next     = (prev + dir + PROJECTS.length) % PROJECTS.length;
    const nextP    = PROJECTS[next];
    const prevP    = PROJECTS[prev];
    const prevInners = lineInnerRefs.current.slice(0, prevP.lines.length).filter(Boolean);

    const tl = gsap.timeline({
      onComplete: () => { animatingRef.current = false; },
    });

    // ── OUT ──
    tl
      // Title lines slide up and out
      .to(prevInners, {
        y: dir > 0 ? '-110%' : '110%',
        stagger: { each: 0.04, from: dir > 0 ? 'start' : 'end' },
        duration: 0.45,
        ease: 'power2.in',
      }, 0)
      // Meta, tags, desc, view fade out
      .to([metaRef.current, tagsRef.current, descRef.current, viewRef.current, dividerRef.current], {
        opacity: 0, y: dir > 0 ? -10 : 10, duration: 0.3, ease: 'power2.in', stagger: 0.03,
      }, 0)
      // Visual wipes out
      .to(visualRef.current, {
        clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
        duration: 0.5,
        ease: 'power2.inOut',
      }, 0.1)

      // ── SWAP DOM ──
      .add(() => {
        currentRef.current = next;
        setDisplayIdx(next);

        // Update title lines
        lineWrapRefs.current.forEach((wrap, i) => {
          if (!wrap) return;
          const inner = lineInnerRefs.current[i];
          const line  = nextP.lines[i];
          if (line) {
            wrap.style.display = '';
            if (inner) { inner.textContent = line; }
          } else {
            wrap.style.display = 'none';
          }
        });

        // Update meta text
        if (metaRef.current) {
          metaRef.current.innerHTML =
            `<span style="color:${nextP.accent}">${nextP.role}</span>` +
            `<span style="opacity:.3;margin:0 10px">·</span>` +
            `${nextP.studio}` +
            `<span style="opacity:.3;margin:0 10px">·</span>` +
            `${nextP.year}`;
        }
        // Update tags
        if (tagsRef.current) {
          tagsRef.current.innerHTML = nextP.tags.map(t =>
            `<span style="font-family:var(--font-body);font-size:10px;letter-spacing:.18em;text-transform:uppercase;padding:5px 12px;border:1px solid rgba(255,255,255,.08);color:rgba(245,240,232,.35);background:rgba(255,255,255,.02)">${t}</span>`
          ).join('');
        }
        // Update desc
        if (descRef.current) descRef.current.textContent = nextP.description;
        // Update watermark number
        if (numRef.current) numRef.current.textContent = nextP.id;
        // Update visual background + image
        if (visualBgRef.current) visualBgRef.current.style.background = nextP.visualBg;
        if (visualGlowRef.current) visualGlowRef.current.style.background = nextP.accent;
        if (visualImgRef.current) visualImgRef.current.src = nextP.image;
        // Update counter
        if (counterRef.current) {
          counterRef.current.querySelector('.cur').textContent = String(next + 1).padStart(2, '0');
        }

        // Reset positions for IN animation
        const nextInners = lineInnerRefs.current.slice(0, nextP.lines.length).filter(Boolean);
        gsap.set(nextInners, { y: dir > 0 ? '110%' : '-110%' });
        gsap.set([metaRef.current, tagsRef.current, descRef.current, viewRef.current, dividerRef.current], { opacity: 0, y: dir > 0 ? 18 : -18 });
        gsap.set(visualRef.current, { clipPath: dir > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' });
      })

      // ── IN ──
      .to(visualRef.current, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.8,
        ease: 'power3.inOut',
      }, '+=0.02')
      .to(lineInnerRefs.current.slice(0, nextP.lines.length).filter(Boolean), {
        y: 0,
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out',
      }, '<0.1')
      .to(dividerRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '<0.3')
      .to([metaRef.current, tagsRef.current, descRef.current, viewRef.current], {
        opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.07,
      }, '<0.05');
  }, []);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft')  navigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  // ── Touch swipe ───────────────────────────────────────────────────────────
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) navigate(1);
    if (dx > 50)  navigate(-1);
    touchStartX.current = null;
  };

  const p0 = PROJECTS[0];

  return (
    <section
      id="selected-work"
      ref={sectionRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: 'var(--bg)',
        borderTop: '1px solid var(--separator)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        ref={headerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '36px 80px 0',
          flexShrink: 0,
          opacity: 0,
        }}
      >
        <div className="section-label">
          <span style={{ width: 28, height: 1, background: 'rgba(232,213,163,0.3)', display: 'inline-block' }}/>
          02 — Selected Work
        </div>
        {/* Dot progress */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => navigate(i - currentRef.current)}
              style={{
                width: i === displayIdx ? 28 : 8,
                height: 2,
                background: i === displayIdx ? 'var(--gold)' : 'rgba(232,213,163,0.18)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'width 0.4s ease, background 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Main carousel body ──────────────────────────────────────────── */}
      <div className="sw-body" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 0,
      }}>

        {/* Left: text content ────────────────────────────────────────── */}
        <div className="sw-text" style={{
          flex: '0 0 56%',
          padding: '50px 80px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Watermark project number */}
          <div
            ref={numRef}
            className="sw-num"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(70px, 10vw, 140px)',
              lineHeight: 1,
              color: 'rgba(232,213,163,0.05)',
              letterSpacing: '0.04em',
              userSelect: 'none',
              pointerEvents: 'none',
              marginBottom: -30,
              opacity: 0,
            }}
          >
            {p0.id}
          </div>

          {/* Title lines — each wrapped in overflow:hidden for curtain reveal */}
          <div style={{ marginBottom: 28 }}>
            {Array.from({ length: MAX_LINES }).map((_, i) => (
              <div
                key={i}
                ref={el => { lineWrapRefs.current[i] = el; }}
                style={{
                  overflow: 'hidden',
                  lineHeight: 1,
                  display: i < p0.lines.length ? '' : 'none',
                }}
              >
                <div
                  ref={el => { lineInnerRefs.current[i] = el; }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(52px, 7.5vw, 115px)',
                    letterSpacing: '0.05em',
                    color: 'var(--text)',
                    display: 'block',
                    paddingBottom: '0.05em',
                  }}
                >
                  {p0.lines[i] || ''}
                </div>
              </div>
            ))}
          </div>

          {/* Animated divider */}
          <div
            ref={dividerRef}
            style={{
              width: 48, height: 1,
              background: `linear-gradient(90deg, ${p0.accent}, transparent)`,
              marginBottom: 24,
              opacity: 0,
            }}
          />

          {/* Role · Studio · Year */}
          <div
            ref={metaRef}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11, letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(232,213,163,0.5)',
              marginBottom: 20,
              opacity: 0,
            }}
            dangerouslySetInnerHTML={{
              __html:
                `<span style="color:${p0.accent}">${p0.role}</span>` +
                `<span style="opacity:.3;margin:0 10px">·</span>` +
                `${p0.studio}` +
                `<span style="opacity:.3;margin:0 10px">·</span>` +
                `${p0.year}`,
            }}
          />

          {/* Tags */}
          <div
            ref={tagsRef}
            style={{
              display: 'flex', flexWrap: 'wrap', gap: 8,
              marginBottom: 28, opacity: 0,
            }}
          >
            {p0.tags.map(t => (
              <span key={t} style={{
                fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.18em',
                textTransform: 'uppercase', padding: '5px 12px',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(245,240,232,0.35)', background: 'rgba(255,255,255,0.02)',
              }}>{t}</span>
            ))}
          </div>

          {/* Description */}
          <p
            ref={descRef}
            style={{
              fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.85,
              color: 'rgba(245,240,232,0.42)', maxWidth: 440, marginBottom: 40, opacity: 0,
            }}
          >
            {p0.description}
          </p>

          {/* View project */}
          <div ref={viewRef} style={{ opacity: 0 }}>
            <ViewLink accentColor={p0.accent} />
          </div>
        </div>

        {/* Right: visual block ─────────────────────────────────────── */}
        <div
          ref={visualRef}
          className="sw-visual"
          style={{
            flex: '0 0 44%',
            position: 'relative',
            overflow: 'hidden',
            clipPath: 'inset(0 100% 0 0)',
          }}
        >
          {/* Per-project colour background (stays behind image) */}
          <div
            ref={visualBgRef}
            style={{
              position: 'absolute', inset: 0,
              background: p0.visualBg,
            }}
          />

          {/* Project poster image — on top of colour bg */}
          <img
            ref={visualImgRef}
            src={p0.image}
            alt=""
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              display: 'block',
              zIndex: 1,
            }}
          />

          {/* Static left-edge fade so image blends into text panel */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, var(--bg) 0%, transparent 28%)',
            zIndex: 2, pointerEvents: 'none',
          }} />

          {/* Accent glow */}
          <div
            ref={visualGlowRef}
            style={{
              position: 'absolute', top: '25%', left: '15%',
              width: 320, height: 320, borderRadius: '50%',
              background: p0.accent,
              opacity: 0.14, filter: 'blur(90px)', pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Film strip */}
          <FilmStrip />

          {/* Giant watermark */}
          <div style={{
            position: 'absolute', bottom: -20, right: -10,
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(160px, 22vw, 320px)',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.022)',
            letterSpacing: '0.04em',
            userSelect: 'none', pointerEvents: 'none',
          }}>
            {p0.id}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 80px 44px',
        flexShrink: 0,
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        {/* Counter */}
        <div
          ref={counterRef}
          style={{
            fontFamily: 'var(--font-body)', fontSize: 11,
            letterSpacing: '0.3em', color: 'rgba(232,213,163,0.4)',
          }}
        >
          <span className="cur" style={{ color: 'var(--gold)', fontWeight: 600 }}>
            {String(displayIdx + 1).padStart(2, '0')}
          </span>
          {' / '}
          {String(PROJECTS.length).padStart(2, '0')}
        </div>

        {/* Arrows */}
        <div style={{ display: 'flex', gap: 10 }}>
          <NavArrow dir="prev" label="Previous project" onClick={() => navigate(-1)} />
          <NavArrow dir="next" label="Next project"     onClick={() => navigate(1)}  />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sw-body { flex-direction: column !important; }
          .sw-text { flex: none !important; width: 100% !important; padding: 24px 20px 20px !important; justify-content: flex-start !important; order: 2; }
          .sw-visual { flex: none !important; width: 100% !important; height: 45vw !important; min-height: 220px !important; max-height: 320px !important; order: 1; }
          .sw-visual { clip-path: none !important; }
          .sw-num { font-size: clamp(60px, 18vw, 100px) !important; margin-bottom: -10px !important; }
        }
      `}</style>
    </section>
  );
}

// ── Film strip ────────────────────────────────────────────────────────────────
function FilmStrip() {
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0,
      width: 26, background: 'rgba(0,0,0,0.45)',
      borderRight: '1px solid rgba(255,255,255,0.04)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-evenly',
      padding: '20px 0', zIndex: 2,
    }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} style={{
          width: 10, height: 13, borderRadius: 2,
          background: 'rgba(255,255,255,0.07)',
        }}/>
      ))}
    </div>
  );
}

// ── View project link ────────────────────────────────────────────────────────
function ViewLink({ accentColor }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#"
      onClick={e => e.preventDefault()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 14,
        fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.3em',
        textTransform: 'uppercase', textDecoration: 'none',
        color: hover ? accentColor : 'rgba(232,213,163,0.5)',
        transition: 'color 0.3s ease',
      }}
    >
      View Project
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 38, height: 38,
        border: `1px solid ${hover ? accentColor : 'rgba(232,213,163,0.2)'}`,
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        transform: hover ? 'rotate(-45deg)' : 'rotate(0)',
        color: hover ? accentColor : 'rgba(232,213,163,0.4)',
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </a>
  );
}

// ── Nav arrow ─────────────────────────────────────────────────────────────────
function NavArrow({ dir, label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 48, height: 48,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hover ? 'rgba(232,213,163,0.06)' : 'transparent',
        border: `1px solid ${hover ? 'rgba(232,213,163,0.4)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '50%',
        color: hover ? 'var(--gold)' : 'rgba(232,213,163,0.4)',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        {dir === 'prev'
          ? <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
    </button>
  );
}
