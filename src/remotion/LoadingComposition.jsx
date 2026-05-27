import React from 'react';
import {
  AbsoluteFill, Easing, Sequence,
  interpolate, spring, useCurrentFrame, useVideoConfig,
} from 'remotion';

import { Clapperboard }  from './components/Clapperboard';
import { DustParticles } from './components/DustParticles';
import { FilmGrain }     from './components/FilmGrain';
import { C }             from './utils/colors';

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE  (global frames, 30fps)
//   0– 20  Scene 01 — Blackout + projector flicker warmup
//  20– 60  Scene 02 — Board slides in (weighted spring)
//  60– 90  Scene 03 — 7 slate fields stamp in (staggered)
//  90–120  Scene 04 — Arm rises slowly (tension build + camera push-in)
// 120–135  Scene 05 — Arm SNAPS down (overshoot bounce, board shake)
// 135–155  Scene 06 — Impact: flash + shockwave + dust + chroma + lens flare
// 155–180  Scene 07 — Board recedes
// 180–210  Scene 08 — Iris wipe reveals hero
// ─────────────────────────────────────────────────────────────────────────────

const FIELD_DEFS = [
  { label: 'PRODUCTION', value: 'Nitin Gadila Portfolio', delay: 0  },
  { label: 'DIRECTOR',   value: 'N. GADILA',              delay: 5  },
  { label: 'CAMERA',     value: 'A',                      delay: 8  },
  { label: 'DATE',       value: '2025',                   delay: 11 },
  { label: 'SCENE',      value: '01',                     delay: 14 },
  { label: 'TAKE',       value: '01',                     delay: 17 },
  { label: 'ROLL',       value: 'PORTFOLIO',              delay: 20 },
];

// Seeded random (deterministic)
const sr = (s) => { const x = Math.sin(s + 1) * 10000; return x - Math.floor(x); };

// Ambient dust motes floating in projector beam
const MOTES = Array.from({ length: 22 }, (_, i) => ({
  x0:    880 + sr(i * 7)  * 160,   // start x near center
  y0:    200 + sr(i * 11) * 400,   // start y
  vx:    (sr(i * 13) - 0.5) * 0.5, // horizontal drift
  vy:    -(0.4 + sr(i * 17) * 0.6),// upward speed
  size:  1 + sr(i * 19) * 2.5,
  phase: sr(i * 23) * 200,
}));

export const LoadingComposition = () => {
  const frame   = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene 01: Projector warmup with flicker ────────────────────────────────
  // Three fast flickers (frames 0-8) then ramp up
  const flickerBase = frame < 8
    ? (Math.floor(frame) % 2 === 0 ? 0 : 0.07)
    : 0;
  const beamRamp = interpolate(frame, [8, 22], [0.06, 0.14], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const beamFadeOut = interpolate(frame, [130, 155], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const beamOpacity = (flickerBase + beamRamp) * beamFadeOut;

  // ── Scene 02: Board slide-in ───────────────────────────────────────────────
  const slideSpring = spring({
    frame: frame - 20, fps,
    config: { damping: 18, stiffness: 80, mass: 1.4 },
    durationInFrames: 40,
  });
  const rotateSpring = spring({
    frame: frame - 20, fps,
    config: { damping: 22, stiffness: 120, mass: 1 },
    durationInFrames: 40,
  });
  const boardSlideY = interpolate(slideSpring,  [0, 1], [920, 0]);
  const boardRotate = interpolate(rotateSpring, [0, 1], [8,  -2]);

  // ── Scene 03: Text stamp ───────────────────────────────────────────────────
  const textFields = FIELD_DEFS.map(f => {
    const s = 60 + f.delay;
    return {
      label:   f.label,
      value:   f.value,
      opacity: interpolate(frame, [s, s + 3],  [0, 1],    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      scale:   interpolate(frame, [s, s + 7],  [1.4, 1],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      glow:    interpolate(frame, [s, s + 2, s + 8], [0, 0.45, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    };
  });

  // ── Scene 04: Arm rise + camera push ──────────────────────────────────────
  const armRise = interpolate(frame, [90, 120], [0, 45], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
  });
  const cameraScale = interpolate(frame, [90, 135], [1.0, 1.08], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const vignetteStrength = interpolate(
    frame,
    [0,    60,   90,   120,  155,  180 ],
    [0.60, 0.65, 0.65, 0.92, 0.72, 0.45],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Scene 05: Arm snap ─────────────────────────────────────────────────────
  const snapSpring = spring({
    frame: frame - 120, fps,
    config: { damping: 8, stiffness: 580, mass: 0.5 },
    durationInFrames: 22,
  });
  // clamp prevents the underdamped spring from flying past arm limits
  const armSnap  = interpolate(snapSpring, [0, 1], [45, -12], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const armAngle = frame < 120 ? armRise : armSnap;

  // Board recoil Y — longer, more physical bounce
  const boardRecoilY = interpolate(
    frame,
    [120, 122, 125, 129, 133, 137, 140],
    [0,    26,  -11,  7,   -4,   2,   0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  // Board shake X — more frames, decaying oscillation
  const boardShakeX = interpolate(
    frame,
    [120, 121, 123, 125, 127, 129, 131, 133, 135, 137],
    [0,  -20,  30, -18,  12,  -8,   5,  -3,   2,   0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Whole-scene camera shake — entire frame shakes on impact
  const camShakeX = interpolate(
    frame,
    [120, 121, 122, 123, 124, 125, 126, 127, 128],
    [0,   -8,  12,  -9,   6,  -4,   2,  -1,   0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const camShakeY = interpolate(
    frame,
    [120, 121, 122, 123, 124, 125, 126, 127],
    [0,    5,  -8,   5,  -3,   2,  -1,   0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const camRotate = interpolate(
    frame,
    [120, 121, 122, 123, 124, 125, 126],
    [0,  -0.6, 0.9, -0.6, 0.3, -0.1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Scene 06: Impact effects ───────────────────────────────────────────────
  // 1-frame black pre-flash (frames 119-120) → instant white → amber decay
  const preFlashBlack = interpolate(frame, [119, 120, 121], [0, 0.85, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const flashOpacity = interpolate(
    frame, [120, 121, 126, 150], [0, 0.98, 0.60, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const flashColor = frame < 126 ? '#ffffff' : `rgba(255,245,220,0.7)`;

  // Anamorphic lens streak — horizontal bright line across frame
  const streakOpacity = interpolate(frame, [120, 121, 124, 130], [0, 1, 0.5, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const streakWidth = interpolate(frame, [120, 121, 130], [0, 1920, 800], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Shockwave — faster expansion, more rings
  const ringR  = interpolate(frame, [120, 145], [10,  420], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const ringR2 = interpolate(frame, [120, 152], [6,   330], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const ringOpacity = interpolate(frame, [120, 124, 150], [0, 0.75, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ringStroke  = interpolate(frame, [120, 150], [8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Chromatic aberration
  const chromaShift = interpolate(frame, [120, 122, 130], [0, 7, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Lens flare (starburst at impact point)
  const flareOpacity = interpolate(frame, [120, 121, 126, 134], [0, 1, 0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flareScale   = interpolate(frame, [120, 126], [0.4, 2.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Film grain spikes on impact
  const grainOpacity = interpolate(
    frame,
    [0,   120, 122, 145, 210],
    [0.04, 0.04, 0.20, 0.06, 0.06],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Scene 07: Board recedes ────────────────────────────────────────────────
  const pullSpring = spring({
    frame: frame - 155, fps,
    config: { damping: 20, stiffness: 55, mass: 1.3 },
    durationInFrames: 25,
  });
  const boardPullScale   = interpolate(pullSpring, [0, 1], [1.08, 0.22]);
  const boardPullOpacity = interpolate(pullSpring, [0, 0.65, 1], [1, 1, 0]);
  const boardPullY       = interpolate(pullSpring, [0, 1], [0, -120]);

  // Combine scale/opacity/Y across all scenes
  const finalScale   = frame < 155 ? cameraScale : boardPullScale;
  const finalOpacity = frame < 155 ? 1 : boardPullOpacity;
  const finalY       = boardSlideY + boardRecoilY + (frame >= 155 ? boardPullY : 0);

  // ── Scene 08: Iris wipe ────────────────────────────────────────────────────
  const irisProgress = interpolate(frame, [180, 210], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const irisR = interpolate(irisProgress, [0, 1], [18, 1650]);
  const irisGlowOpacity = interpolate(frame, [180, 184, 206, 210], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Ambient dust motes in projector beam ──────────────────────────────────
  const showMotes = beamOpacity > 0.02;

  return (
    <AbsoluteFill style={{ background: '#050505', overflow: 'hidden' }}>

      {/* ── CAMERA SHAKE WRAPPER — entire scene shifts on impact ────────── */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        transform: `translate(${camShakeX}px, ${camShakeY}px) rotate(${camRotate}deg)`,
      }}>

        {/* ── PROJECTOR BEAM ─────────────────────────────────────────────── */}
        {beamOpacity > 0.01 && (
          <>
            {/* Main cone */}
            <div style={{
              position: 'absolute',
              top: '-6%', left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft:  '380px solid transparent',
              borderRight: '380px solid transparent',
              borderTop:   '920px solid rgba(232,213,163,0.07)',
              opacity: beamOpacity,
              filter: 'blur(32px)',
              pointerEvents: 'none',
            }}/>
            {/* Inner hot core */}
            <div style={{
              position: 'absolute',
              top: '-6%', left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft:  '120px solid transparent',
              borderRight: '120px solid transparent',
              borderTop:   '500px solid rgba(255,245,220,0.04)',
              opacity: beamOpacity * 1.4,
              filter: 'blur(18px)',
              pointerEvents: 'none',
            }}/>
            {/* Ambient warm glow at top */}
            <div style={{
              position: 'absolute', top: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: 800, height: 500,
              background: 'radial-gradient(ellipse at 50% 0%, rgba(232,213,163,0.06) 0%, transparent 65%)',
              opacity: beamOpacity,
              pointerEvents: 'none',
            }}/>

            {/* Dust motes */}
            {showMotes && (
              <svg style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', overflow: 'visible',
              }} viewBox="0 0 1920 1080">
                {MOTES.map(m => {
                  const t   = (frame + m.phase) % 300;
                  const px  = m.x0 + m.vx * t * 2 + Math.sin(t * 0.04) * 20;
                  const py  = m.y0 + m.vy * t * 2;
                  const vis = py > 0 && py < 900 ? 1 : 0;
                  return (
                    <circle
                      key={m.id}
                      cx={px} cy={py} r={m.size}
                      fill="rgba(232,213,163,0.6)"
                      opacity={vis * 0.35 * beamOpacity}
                    />
                  );
                })}
              </svg>
            )}
          </>
        )}

        {/* ── CLAPPERBOARD ───────────────────────────────────────────────── */}
        {finalOpacity > 0.01 && (
          <Clapperboard
            armAngle={armAngle}
            textFields={textFields}
            boardShakeX={boardShakeX}
            boardRecoilY={0}
            boardScale={finalScale}
            boardOpacity={finalOpacity}
            rotate={boardRotate}
            translateY={finalY}
          />
        )}

        {/* ── LENS FLARE (starburst at impact point) ─────────────────────── */}
        {flareOpacity > 0.01 && (
          <div style={{
            position: 'absolute',
            top: '38%', left: '50%',
            transform: `translate(-50%, -50%) scale(${flareScale})`,
            pointerEvents: 'none', zIndex: 85,
          }}>
            <svg width="300" height="300" viewBox="-150 -150 300 300" overflow="visible">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const len   = i % 3 === 0 ? 140 : i % 3 === 1 ? 80 : 50;
                return (
                  <line key={i}
                    x1="0" y1="0"
                    x2={Math.cos(angle) * len}
                    y2={Math.sin(angle) * len}
                    stroke={i % 3 === 0 ? 'rgba(255,245,220,0.9)' : 'rgba(232,213,163,0.6)'}
                    strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
                    opacity={flareOpacity}
                    strokeLinecap="round"
                  />
                );
              })}
              <circle cx="0" cy="0" r="28" fill="rgba(255,255,255,0.95)" opacity={flareOpacity}/>
              <circle cx="0" cy="0" r="60" fill="rgba(232,213,163,0.4)"  opacity={flareOpacity}/>
              <circle cx="0" cy="0" r="100" fill="rgba(232,213,163,0.1)" opacity={flareOpacity}/>
            </svg>
          </div>
        )}

        {/* ── PRE-FLASH BLACK (1 frame anticipation just before snap) ────── */}
        {preFlashBlack > 0.01 && (
          <div style={{
            position: 'absolute', inset: 0,
            background: '#000',
            opacity: preFlashBlack,
            pointerEvents: 'none', zIndex: 79,
          }}/>
        )}

        {/* ── SCREEN FLASH ───────────────────────────────────────────────── */}
        {flashOpacity > 0.01 && (
          <div style={{
            position: 'absolute', inset: 0,
            background: flashColor,
            opacity: flashOpacity,
            pointerEvents: 'none', zIndex: 80,
          }}/>
        )}

        {/* ── ANAMORPHIC LENS STREAK ─────────────────────────────────────── */}
        {streakOpacity > 0.01 && (
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: streakWidth,
            height: 4,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 15%, rgba(255,248,230,1) 50%, rgba(255,255,255,0.5) 85%, transparent 100%)',
            opacity: streakOpacity,
            filter: 'blur(1.5px)',
            boxShadow: '0 0 18px 6px rgba(255,245,220,0.55), 0 0 40px 14px rgba(232,213,163,0.25)',
            pointerEvents: 'none', zIndex: 83,
          }}/>
        )}

        {/* ── CHROMATIC ABERRATION ───────────────────────────────────────── */}
        {chromaShift > 0.1 && (
          <>
            <div style={{
              position: 'absolute', inset: 0,
              transform: `translateX(${chromaShift}px)`,
              background: 'rgba(255,0,0,0.14)',
              mixBlendMode: 'screen',
              opacity: Math.min(chromaShift / 7, 0.7),
              pointerEvents: 'none', zIndex: 75,
            }}/>
            <div style={{
              position: 'absolute', inset: 0,
              transform: `translateX(${-chromaShift}px)`,
              background: 'rgba(0,100,255,0.14)',
              mixBlendMode: 'screen',
              opacity: Math.min(chromaShift / 7, 0.7),
              pointerEvents: 'none', zIndex: 75,
            }}/>
          </>
        )}

        {/* ── SHOCKWAVE RINGS ────────────────────────────────────────────── */}
        {ringOpacity > 0.01 && (
          <svg
            viewBox="0 0 1920 1080"
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none', zIndex: 60, overflow: 'visible',
            }}
          >
            <circle cx={960} cy={420} r={ringR}
              fill="none" stroke={C.gold} strokeWidth={ringStroke}
              opacity={ringOpacity}
            />
            <circle cx={960} cy={420} r={ringR2}
              fill="none" stroke="rgba(255,255,255,0.5)"
              strokeWidth={Math.max(0, ringStroke - 3)}
              opacity={ringOpacity * 0.55}
            />
            <circle cx={960} cy={420}
              r={interpolate(frame, [120, 142], [6, 200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
              fill="none" stroke="rgba(255,245,220,0.3)"
              strokeWidth={Math.max(0, ringStroke - 4)}
              opacity={interpolate(frame, [120, 122, 142], [0, 0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            />
          </svg>
        )}

        {/* ── DUST PARTICLES ─────────────────────────────────────────────── */}
        <Sequence from={120} durationInFrames={20}>
          <DustParticles />
        </Sequence>

      </div>{/* end camera shake wrapper */}

      {/* ── IRIS WIPE ──────────────────────────────────────────────────── */}
      {frame >= 178 && (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            background: '#050505',
            WebkitMaskImage: `radial-gradient(circle ${irisR}px at 50% 50%, transparent ${irisR - 5}px, black ${irisR + 3}px)`,
            maskImage:       `radial-gradient(circle ${irisR}px at 50% 50%, transparent ${irisR - 5}px, black ${irisR + 3}px)`,
            zIndex: 90,
          }}/>
          {irisR < 1400 && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width:  Math.min(irisR * 2 + 50, 2400),
              height: Math.min(irisR * 2 + 50, 2400),
              borderRadius: '50%',
              border: '2.5px solid rgba(232,213,163,0.22)',
              boxShadow: '0 0 50px rgba(232,213,163,0.09), inset 0 0 50px rgba(232,213,163,0.04)',
              pointerEvents: 'none',
              zIndex: 91,
              opacity: irisGlowOpacity,
            }}/>
          )}
        </>
      )}

      {/* ── VIGNETTE ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 99,
        background: `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,${vignetteStrength}) 100%)`,
      }}/>

      {/* ── FILM GRAIN ─────────────────────────────────────────────────── */}
      <FilmGrain opacity={grainOpacity} />

    </AbsoluteFill>
  );
};
