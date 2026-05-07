import React, { useEffect, useState, useRef } from 'react';

const SEQUENCE = [3, 2, 1];
const SHOW_MS  = 950;

// Vertical film strip edge
function FilmStrip() {
  return (
    <div style={{
      width: 84,
      height: '100vh',
      background: '#020202',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flexShrink: 0,
      zIndex: 2,
    }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{
          width: 34,
          height: 24,
          borderRadius: 5,
          background: '#efefef',
          boxShadow: '0 0 10px rgba(255,255,255,0.3), inset 0 1px 3px rgba(255,255,255,0.6)',
        }}/>
      ))}
    </div>
  );
}

export default function Loader({ onComplete }) {
  const [index, setIndex]   = useState(0);
  const [flash, setFlash]   = useState(false);
  const [fading, setFading] = useState(false);
  const canvasRef           = useRef(null);
  const doneRef             = useRef(false);

  // Film grain canvas — runs independently
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = 580;
    canvas.height = 435;
    const ctx = canvas.getContext('2d');
    let af, frame = 0;

    function drawGrain() {
      frame++;
      if (frame % 3 === 0) {
        const img = ctx.createImageData(580, 435);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          d[i] = d[i+1] = d[i+2] = v;
          d[i+3] = (Math.random() * 20) | 0;
        }
        ctx.putImageData(img, 0, 0);
      }
      af = requestAnimationFrame(drawGrain);
    }
    drawGrain();
    return () => cancelAnimationFrame(af);
  }, []);

  // Countdown logic
  useEffect(() => {
    if (doneRef.current) return;
    const t = setTimeout(() => {
      if (index < SEQUENCE.length - 1) {
        setFlash(true);
        setTimeout(() => { setFlash(false); setIndex(i => i + 1); }, 130);
      } else {
        doneRef.current = true;
        setFlash(true);
        setTimeout(() => {
          setFlash(false);
          setFading(true);
          setTimeout(onComplete, 700);
        }, 200);
      }
    }, SHOW_MS);
    return () => clearTimeout(t);
  }, [index, onComplete]);

  const num = SEQUENCE[index];

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: '#000',
      display: 'flex',
      alignItems: 'stretch',
      zIndex: 99999,
      opacity: fading ? 0 : 1,
      transition: fading ? 'opacity 0.7s ease' : 'none',
    }}>
      <FilmStrip/>

      {/* Centre content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>

        {/* Film leader frame */}
        <div style={{
          width: 'min(62vw, 580px)',
          aspectRatio: '4 / 3',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 5,
          background: flash
            ? '#ffffff'
            : 'radial-gradient(ellipse at 36% 30%, #e6e6e6 0%, #c2c2c2 30%, #b0b0b0 55%, #8e8e8e 80%, #9e9e9e 100%)',
          boxShadow: flash
            ? '0 0 120px rgba(255,255,255,0.95), 0 0 40px rgba(255,255,255,0.6)'
            : '0 0 60px rgba(0,0,0,0.85), 0 0 24px rgba(232,213,163,0.06)',
          transition: flash ? 'background 0.03s, box-shadow 0.03s' : 'background 0.1s',
          animation: !flash && !fading ? 'ldFlicker 4s linear infinite' : 'none',
        }}>

          {/* Registration lines + circles — hidden during flash */}
          <svg
            viewBox="0 0 400 300"
            preserveAspectRatio="xMidYMid meet"
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              zIndex: 1,
              opacity: flash ? 0 : 1,
              transition: 'opacity 0.03s',
            }}
          >
            {/* Quadrant cross */}
            <line x1="200" y1="0"   x2="200" y2="300" stroke="rgba(0,0,0,0.26)" strokeWidth="1.5"/>
            <line x1="0"   y1="150" x2="400" y2="150" stroke="rgba(0,0,0,0.26)" strokeWidth="1.5"/>
            {/* Registration scratch */}
            <line x1="0" y1="300" x2="400" y2="0" stroke="rgba(0,0,0,0.16)" strokeWidth="1.5"/>
            {/* Outer circle */}
            <circle cx="200" cy="150" r="112" fill="none" stroke="rgba(0,0,0,0.3)"  strokeWidth="2"/>
            {/* Mid circle */}
            <circle cx="200" cy="150" r="76"  fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth="1.5"/>
            {/* Centre dot */}
            <circle cx="200" cy="150" r="14"  fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth="1"/>
            {/* Corner marks */}
            <line x1="0"   y1="0"   x2="28"  y2="0"   stroke="rgba(0,0,0,0.22)" strokeWidth="1.5"/>
            <line x1="0"   y1="0"   x2="0"   y2="28"  stroke="rgba(0,0,0,0.22)" strokeWidth="1.5"/>
            <line x1="400" y1="0"   x2="372" y2="0"   stroke="rgba(0,0,0,0.22)" strokeWidth="1.5"/>
            <line x1="400" y1="0"   x2="400" y2="28"  stroke="rgba(0,0,0,0.22)" strokeWidth="1.5"/>
            <line x1="0"   y1="300" x2="28"  y2="300" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5"/>
            <line x1="0"   y1="300" x2="0"   y2="272" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5"/>
            <line x1="400" y1="300" x2="372" y2="300" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5"/>
            <line x1="400" y1="300" x2="400" y2="272" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5"/>
            {/* Metadata labels */}
            <text x="12" y="292" fontFamily="monospace" fontSize="10" fill="rgba(0,0,0,0.28)" letterSpacing="2">ACADEMY LEADER</text>
            <text x="388" y="292" fontFamily="monospace" fontSize="10" fill="rgba(0,0,0,0.28)" textAnchor="end">24 FPS</text>
            <text x="12" y="16" fontFamily="monospace" fontSize="10" fill="rgba(0,0,0,0.2)">NG · 2025</text>
          </svg>

          {/* Film grain canvas — always mounted */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              zIndex: 2, pointerEvents: 'none',
              mixBlendMode: 'overlay',
              opacity: flash ? 0 : 0.75,
            }}
          />

          {/* Countdown number */}
          <div
            key={num}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: '"Bebas Neue", "Arial Black", Impact, sans-serif',
              fontSize: 'clamp(100px, 18vw, 172px)',
              color: '#0e0e0e',
              lineHeight: 1,
              userSelect: 'none',
              zIndex: 3,
              opacity: flash ? 0 : 1,
              transition: 'opacity 0.03s',
              animation: !flash ? 'ldNumIn 0.14s cubic-bezier(0.22,1,0.36,1)' : 'none',
              textShadow: '1px 2px 0 rgba(0,0,0,0.12)',
            }}
          >
            {num}
          </div>
        </div>

        {/* Progress bars */}
        <div style={{ display: 'flex', gap: 10, marginTop: 22, alignItems: 'center' }}>
          {SEQUENCE.map((_, i) => (
            <div key={i} style={{
              height: 3,
              width: i <= index ? 28 : 10,
              background: i <= index ? 'var(--gold)' : '#2a2a2a',
              borderRadius: 2,
              transition: 'all 0.35s ease',
              boxShadow: i === index ? '0 0 8px rgba(232,213,163,0.5)' : 'none',
            }}/>
          ))}
        </div>

        <div style={{
          marginTop: 14,
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          letterSpacing: '0.4em',
          color: 'rgba(255,255,255,0.12)',
          textTransform: 'uppercase',
        }}>
          Nitin Gadila · Portfolio 2025
        </div>
      </div>

      <FilmStrip/>

      <style>{`
        @keyframes ldNumIn {
          from { opacity:0; transform: translate(-50%,-44%) scale(0.88); }
          to   { opacity:1; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes ldFlicker {
          0%,100% { filter: brightness(1); }
          88%     { filter: brightness(1); }
          89%     { filter: brightness(1.10); }
          90%     { filter: brightness(0.95); }
          91%     { filter: brightness(1.04); }
          92%     { filter: brightness(1); }
          96%     { filter: brightness(1); }
          96.5%   { filter: brightness(0.97); }
          97%     { filter: brightness(1); }
        }
      `}</style>
    </div>
  );
}
