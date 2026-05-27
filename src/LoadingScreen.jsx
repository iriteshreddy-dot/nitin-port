import React, { useState, useEffect, useRef, useCallback } from 'react';
import { animate, interpolate, Easing } from './animations';

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:       '#060404',
  board:    '#080808',
  gold:     '#C9A84C',
  goldGlow: 'rgba(201,168,76,0.35)',
  white:    '#F0EBE0',
  label:    'rgba(240,235,224,0.55)',
  divider:  'rgba(255,255,255,0.13)',
};

// ── Timeline (seconds) ───────────────────────────────────────────────────────
const T = {
  BEAM:         0.25,
  BOARD_SLIDE:  0.50,
  BOARD_IN:     1.30,
  STAMP_START:  1.55,
  STAMP_STEP:   0.20,
  ARM_RISE:     2.90,
  ARM_SNAP:     3.70,
  RECEDE:       4.05,
  DONE:         5.10,
};
const DURATION = 5.40;

// ── Field data ───────────────────────────────────────────────────────────────
const TOP_FIELDS = [
  { key: 'title',    label: 'TITLE',    value: 'NITIN GADILA PORTFOLIO', gold: true },
  { key: 'director', label: 'DIRECTOR', value: 'N. GADILA' },
  { key: 'camera',   label: 'CAMERA',   value: 'A' },
];
const BOT_FIELDS = [
  { key: 'date',  label: 'DATE',  value: '2025' },
  { key: 'scene', label: 'SCENE', value: '01' },
  { key: 'take',  label: 'TAKE',  value: '01' },
];
const ALL_FIELDS = [...TOP_FIELDS, ...BOT_FIELDS];

// ── Main component ───────────────────────────────────────────────────────────
export default function LoadingScreen({ onDone }) {
  const [time, setTime] = useState(0);
  const lastTsRef = useRef(null);
  const doneRef   = useRef(false);

  const finish = useCallback(() => {
    if (!doneRef.current) { doneRef.current = true; onDone?.(); }
  }, [onDone]);

  useEffect(() => {
    let raf;
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;
      setTime(prev => {
        const next = prev + dt;
        if (next >= T.DONE) { finish(); return DURATION; }
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  const t = time;

  // ── Projector beam ────────────────────────────────────────────────────────
  const beamOpacity = animate({ from: 0, to: 1, start: T.BEAM, end: T.BEAM + 0.9, ease: Easing.easeOutSine })(t);

  // ── Board: slide-in & tilt ────────────────────────────────────────────────
  const boardSlideY = animate({ from: 900, to: 0, start: T.BOARD_SLIDE, end: T.BOARD_IN, ease: Easing.easeOutBack })(t);
  const boardRotate = animate({ from: 5, to: -1.8, start: T.BOARD_SLIDE, end: T.BOARD_IN, ease: Easing.easeOutCubic })(t);

  // ── Camera push-in during arm rise ────────────────────────────────────────
  const cameraScale = animate({ from: 1, to: 1.06, start: T.ARM_RISE, end: T.ARM_SNAP, ease: Easing.easeInOutSine })(t);

  // ── Board recede after snap ───────────────────────────────────────────────
  const recedeScale   = animate({ from: 1.06, to: 0.04, start: T.RECEDE, end: T.RECEDE + 0.75, ease: Easing.easeInQuart })(t);
  const recedeOpacity = animate({ from: 1, to: 0, start: T.RECEDE + 0.3, end: T.RECEDE + 0.75, ease: Easing.easeInCubic })(t);
  const finalScale    = t < T.RECEDE ? cameraScale : recedeScale;
  const boardOpacity  = t < T.RECEDE + 0.3 ? 1 : recedeOpacity;

  // ── Arm ───────────────────────────────────────────────────────────────────
  const armRise = animate({ from: 0, to: -44, start: T.ARM_RISE, end: T.ARM_SNAP - 0.12, ease: Easing.easeInOutCubic })(t);
  const armSnap = interpolate(
    [T.ARM_SNAP, T.ARM_SNAP+0.05, T.ARM_SNAP+0.11, T.ARM_SNAP+0.17, T.ARM_SNAP+0.25],
    [-44, 14, -6, 3, 0]
  )(t);
  const armAngle = t < T.ARM_SNAP ? armRise : armSnap;

  // ── Board shake on impact ─────────────────────────────────────────────────
  const shakeX = interpolate(
    [T.ARM_SNAP, T.ARM_SNAP+0.04, T.ARM_SNAP+0.09, T.ARM_SNAP+0.14, T.ARM_SNAP+0.19, T.ARM_SNAP+0.26],
    [0, -18, 24, -11, 6, 0]
  )(t);
  const shakeY = interpolate(
    [T.ARM_SNAP, T.ARM_SNAP+0.06, T.ARM_SNAP+0.13, T.ARM_SNAP+0.21],
    [0, 16, -6, 0]
  )(t);

  // ── Screen flash ──────────────────────────────────────────────────────────
  const flashOpacity = interpolate(
    [T.ARM_SNAP, T.ARM_SNAP+0.04, T.ARM_SNAP+0.22],
    [0.92, 0.55, 0]
  )(t);

  // ── Shockwave ring ────────────────────────────────────────────────────────
  const ringR = animate({ from: 12, to: 420, start: T.ARM_SNAP, end: T.ARM_SNAP + 0.7, ease: Easing.easeOutExpo })(t);
  const ringOpacity = t >= T.ARM_SNAP
    ? interpolate([T.ARM_SNAP, T.ARM_SNAP+0.08, T.ARM_SNAP+0.7], [0.85, 0.5, 0])(t)
    : 0;
  const ringStroke = t >= T.ARM_SNAP
    ? interpolate([T.ARM_SNAP, T.ARM_SNAP+0.7], [9, 1])(t)
    : 0;

  // ── Chromatic aberration split ────────────────────────────────────────────
  const chromaSplit = interpolate(
    [T.ARM_SNAP, T.ARM_SNAP+0.03, T.ARM_SNAP+0.12],
    [0, 6, 0]
  )(t);
  const chromaOpacity = interpolate(
    [T.ARM_SNAP, T.ARM_SNAP+0.03, T.ARM_SNAP+0.12],
    [0, 0.5, 0]
  )(t);

  // ── Field stamp props (per-field opacity, scale, brightness glow) ─────────
  const fieldProps = ALL_FIELDS.map((f, i) => {
    const st = T.STAMP_START + i * T.STAMP_STEP;
    return {
      ...f,
      opacity:    animate({ from: 0, to: 1, start: st, end: st + 0.12, ease: Easing.easeOutQuad })(t),
      scale:      animate({ from: 1.35, to: 1.0, start: st, end: st + 0.30, ease: Easing.easeOutBack })(t),
      brightness: interpolate([st, st+0.05, st+0.40], [1, 2.2, 1])(t),
    };
  });

  const showBoard = boardOpacity > 0.01;

  return (
    <div style={{ position: 'fixed', inset: 0, background: C.bg, zIndex: 9999, overflow: 'hidden' }}>

      {/* Film grain */}
      <GrainOverlay />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.72) 100%)',
        pointerEvents: 'none', zIndex: 1,
      }}/>

      {/* Projector beam */}
      {beamOpacity > 0.01 && (
        <>
          <div style={{
            position: 'absolute', top: -10, left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '360px solid transparent',
            borderRight: '360px solid transparent',
            borderTop: '860px solid rgba(201,168,76,0.06)',
            filter: 'blur(36px)',
            opacity: beamOpacity,
            pointerEvents: 'none', zIndex: 2,
          }}/>
          <div style={{
            position: 'absolute', top: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: 640, height: 420,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)',
            opacity: beamOpacity,
            pointerEvents: 'none', zIndex: 2,
          }}/>
        </>
      )}

      {/* Clapperboard — outer: position + slide + tilt + recede scale */}
      {showBoard && (
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: 'min(680px, 90vw)',
          transform: `translate(-50%, calc(-50% + ${boardSlideY}px)) rotate(${boardRotate}deg) scale(${finalScale})`,
          opacity: boardOpacity,
          filter: `drop-shadow(0 32px 64px rgba(0,0,0,0.95)) drop-shadow(0 0 44px ${C.goldGlow})`,
          willChange: 'transform, opacity',
          userSelect: 'none',
          zIndex: 10,
        }}>
          {/* Inner: shake */}
          <div style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>

            {/* ── ARM ── */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: 'min(158px, 25vw)',
              transformOrigin: '10px center',
              transform: `rotate(${armAngle}deg)`,
              zIndex: 10,
              borderRadius: '3px 3px 0 0',
              overflow: 'hidden',
              borderBottom: '3px solid #000',
            }}>
              {/* Diagonal stripes */}
              <div style={{
                width: '100%', height: '100%',
                background: 'repeating-linear-gradient(-45deg, #000 0, #000 30px, #fff 30px, #fff 60px)',
              }}/>
              {/* Bottom shadow */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 8,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              }}/>
              {/* Hinge bolts */}
              {[18, 44].map(top => (
                <div key={top} style={{
                  position: 'absolute', left: 12, top,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 32%, #666, #111)',
                  border: '1.5px solid #444', zIndex: 12,
                }}/>
              ))}
            </div>

            {/* ── BOARD BODY ── */}
            <div style={{
              width: '100%',
              background: C.board,
              border: '2px solid rgba(255,255,255,0.07)',
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
              boxShadow: 'inset 0 0 80px rgba(0,0,0,0.6)',
              overflow: 'hidden',
            }}>
              {/* Subtle inner glow */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.012) 0%, transparent 65%)',
                pointerEvents: 'none',
              }}/>

              {/* Top fields: TITLE, DIRECTOR, CAMERA */}
              <div style={{ padding: '0 22px' }}>
                {fieldProps.slice(0, 3).map((f, i) => (
                  <React.Fragment key={f.key}>
                    <FieldRow field={f} />
                    {i < 2 && <Divider />}
                  </React.Fragment>
                ))}
                <Divider />
              </div>

              {/* Bottom row: DATE | SCENE | TAKE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                {fieldProps.slice(3).map((f, i) => (
                  <div key={f.key} style={{
                    padding: '10px 22px 14px',
                    borderRight: i < 2 ? `1px solid ${C.divider}` : 'none',
                  }}>
                    <div style={{
                      fontFamily: '"Helvetica Neue", Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: 'clamp(8px, 1.1vw, 11px)',
                      letterSpacing: '0.14em',
                      color: C.label,
                      textTransform: 'uppercase',
                      marginBottom: 6,
                    }}>
                      {f.label}
                    </div>
                    <div style={{ height: 1, background: C.divider, marginBottom: 6 }}/>
                    <div style={{
                      fontFamily: '"Helvetica Neue", Arial, sans-serif',
                      fontWeight: 400,
                      fontSize: 'clamp(14px, 2.2vw, 22px)',
                      color: C.white,
                      letterSpacing: '0.04em',
                      opacity: f.opacity,
                      transform: `scale(${f.scale})`,
                      transformOrigin: 'left center',
                      filter: `brightness(${f.brightness})`,
                    }}>
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen flash */}
      {flashOpacity > 0.01 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#fff',
          opacity: flashOpacity,
          pointerEvents: 'none', zIndex: 80,
        }}/>
      )}

      {/* Chromatic aberration */}
      {chromaOpacity > 0.01 && (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            transform: `translateX(${chromaSplit}px)`,
            background: 'rgba(255,0,0,0.10)',
            mixBlendMode: 'screen',
            opacity: chromaOpacity,
            pointerEvents: 'none', zIndex: 79,
          }}/>
          <div style={{
            position: 'absolute', inset: 0,
            transform: `translateX(${-chromaSplit}px)`,
            background: 'rgba(0,0,255,0.10)',
            mixBlendMode: 'screen',
            opacity: chromaOpacity,
            pointerEvents: 'none', zIndex: 79,
          }}/>
        </>
      )}

      {/* Shockwave rings */}
      {ringOpacity > 0.01 && (
        <svg style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 75, overflow: 'visible',
        }}>
          <circle
            cx="50%" cy="50%"
            r={ringR} fill="none"
            stroke={C.gold} strokeWidth={ringStroke}
            opacity={ringOpacity}
          />
          <circle
            cx="50%" cy="50%"
            r={Math.max(0, ringR - 44)} fill="none"
            stroke="rgba(255,255,255,0.38)"
            strokeWidth={Math.max(0, ringStroke - 2.5)}
            opacity={ringOpacity * 0.55}
          />
        </svg>
      )}

      {/* SKIP */}
      <SkipButton onSkip={finish} />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GrainOverlay() {
  return (
    <svg style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      opacity: 0.06,
      pointerEvents: 'none', zIndex: 100,
    }}>
      <defs>
        <filter id="grain-ls">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed="7" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#grain-ls)"/>
    </svg>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.divider, margin: '0 -4px' }}/>;
}

function FieldRow({ field }) {
  return (
    <div style={{ padding: field.gold ? '16px 0 10px' : '10px 0' }}>
      <div style={{
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        fontWeight: 700,
        fontSize: 'clamp(8px, 1.1vw, 11px)',
        letterSpacing: '0.18em',
        color: C.label,
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        {field.label}
      </div>
      <div style={{
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        fontWeight: field.gold ? 700 : 400,
        fontSize: field.gold ? 'clamp(18px, 3vw, 30px)' : 'clamp(14px, 2.2vw, 22px)',
        letterSpacing: field.gold ? '0.22em' : '0.06em',
        color: field.gold ? C.gold : C.white,
        textShadow: field.gold && field.opacity > 0.1 ? `0 0 28px ${C.goldGlow}` : 'none',
        textTransform: 'uppercase',
        opacity: field.opacity,
        transform: `scale(${field.scale})`,
        transformOrigin: 'left center',
        filter: `brightness(${field.brightness})`,
        willChange: 'transform, opacity, filter',
      }}>
        {field.value}
      </div>
    </div>
  );
}

function SkipButton({ onSkip }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onSkip}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed', bottom: 28, right: 28,
        padding: '7px 18px',
        background: 'transparent',
        border: `1px solid ${hover ? C.gold : 'rgba(201,168,76,0.3)'}`,
        color: hover ? C.gold : 'rgba(201,168,76,0.5)',
        fontFamily: '"Courier New", monospace',
        fontSize: 10, letterSpacing: '0.2em',
        textTransform: 'uppercase',
        cursor: 'pointer', zIndex: 10000,
        transition: 'color 0.2s, border-color 0.2s',
      }}
    >
      SKIP
    </button>
  );
}
