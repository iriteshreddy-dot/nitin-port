import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function GlobalEffects() {
  const cursorRef = useRef(null);
  const grainRef = useRef(null);
  const soundRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    // Custom cursor
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;
    const onMouseMove = e => { mouseX = e.clientX; mouseY = e.clientY; };
    document.addEventListener('mousemove', onMouseMove);

    let cursorRaf;
    function animateCursor() {
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      if (cursorRef.current) {
        cursorRef.current.style.left = curX + 'px';
        cursorRef.current.style.top = curY + 'px';
      }
      cursorRaf = requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = document.querySelectorAll('a, button, .project-frame, .spotlight-col, .clapperboard-wrap, .play-btn');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRef.current?.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorRef.current?.classList.remove('cursor-hover'));
    });

    // Film grain
    const canvas = grainRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      let frame = 0;
      let grainRaf;
      function grainLoop() {
        frame++;
        if (frame % 3 === 0) {
          const w = canvas.width, h = canvas.height;
          const img = ctx.createImageData(w, h);
          const d = img.data;
          for (let i = 0; i < d.length; i += 4) {
            const v = Math.random() * 255;
            d[i] = d[i+1] = d[i+2] = v;
            d[i+3] = 20;
          }
          ctx.putImageData(img, 0, 0);
        }
        grainRaf = requestAnimationFrame(grainLoop);
      }
      grainLoop();

      // Sound button fade in
      if (soundRef.current) {
        setTimeout(() => { gsap.to(soundRef.current, { opacity: 1, duration: 0.8 }); }, 3500);
      }

      return () => {
        cancelAnimationFrame(cursorRaf);
        cancelAnimationFrame(grainRaf);
        window.removeEventListener('resize', resize);
        document.removeEventListener('mousemove', onMouseMove);
      };
    }

    return () => {
      cancelAnimationFrame(cursorRaf);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        id="cursor"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 20, height: 20,
          pointerEvents: 'none', zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.1s ease, opacity 0.3s',
        }}
      >
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <line x1="10" y1="0" x2="10" y2="7" stroke="#E8D5A3" strokeWidth="1"/>
          <line x1="10" y1="13" x2="10" y2="20" stroke="#E8D5A3" strokeWidth="1"/>
          <line x1="0" y1="10" x2="7" y2="10" stroke="#E8D5A3" strokeWidth="1"/>
          <line x1="13" y1="10" x2="20" y2="10" stroke="#E8D5A3" strokeWidth="1"/>
          <rect x="8" y="8" width="4" height="4" stroke="#E8D5A3" strokeWidth="0.8"/>
        </svg>
      </div>

      {/* Film grain */}
      <canvas ref={grainRef} style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 9998, opacity: 0.055, mixBlendMode: 'overlay',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 9997,
        background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.82) 100%)',
      }} />

      {/* Sound toggle */}
      <button
        ref={soundRef}
        onClick={() => setSoundOn(s => !s)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
          background: 'transparent', border: `1px solid ${soundOn ? 'rgba(232,213,163,0.4)' : 'rgba(232,213,163,0.2)'}`,
          color: soundOn ? 'rgba(232,213,163,0.8)' : 'rgba(232,213,163,0.4)',
          fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.3em',
          textTransform: 'uppercase', padding: '10px 16px', cursor: 'none',
          transition: 'all 0.3s', opacity: 0,
        }}
      >
        {soundOn ? '◉ Sound On' : '◎ Sound Off'}
      </button>

      <style>{`
        #cursor.cursor-hover {
          transform: translate(-50%, -50%) scale(1.8) !important;
          filter: drop-shadow(0 0 6px var(--gold));
        }
      `}</style>
    </>
  );
}
