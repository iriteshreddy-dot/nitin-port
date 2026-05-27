import React, { useRef, useState, useCallback, useEffect } from 'react';

export default function Reel() {
  const videoRef     = useRef(null);
  const hideTimer    = useRef(null);

  const [playing,      setPlaying]      = useState(false);
  const [muted,        setMuted]        = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [started,      setStarted]      = useState(false);

  const fmt = (t) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); setStarted(true); }
    else          { v.pause(); setPlaying(false); }
  }, []);

  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const handleSeek = useCallback((e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = parseFloat(e.target.value);
    setCurrentTime(v.currentTime);
  }, []);

  const handleFullscreen = useCallback((e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen?.();
  }, []);

  const revealControls = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 2800);
  }, []);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section id="reel" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>02 — The Reel</div>
          <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,7vw,96px)', letterSpacing: '0.05em', color: 'var(--text)', lineHeight: 1 }}>
            THE <span style={{ color: 'var(--gold)' }}>WORK</span>
          </h2>
        </div>

        {/* Video frame */}
        <div
          className="reveal"
          onClick={togglePlay}
          onMouseMove={revealControls}
          onMouseEnter={revealControls}
          onMouseLeave={() => { clearTimeout(hideTimer.current); setShowControls(false); }}
          style={{
            position: 'relative',
            width: '100%', maxWidth: 900,
            margin: '0 auto 80px',
            aspectRatio: '16/9',
            border: '1px solid rgba(232,213,163,0.15)',
            overflow: 'hidden',
            cursor: playing && !showControls ? 'none' : 'pointer',
            boxShadow: '0 0 80px rgba(232,213,163,0.08), 0 0 200px rgba(232,213,163,0.04)',
          }}
        >
          {/* ── Film strips top / bottom ── */}
          {['top', 'bottom'].map(pos => (
            <div key={pos} style={{
              position: 'absolute', [pos]: 0, left: 0, right: 0, height: 6, zIndex: 3,
              background: 'repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(232,213,163,0.18) 18px, rgba(232,213,163,0.18) 20px)',
              pointerEvents: 'none',
            }} />
          ))}

          {/* ── Film strips left / right (small) ── */}
          {['left', 'right'].map(side => (
            <div key={side} style={{
              position: 'absolute', [side]: 0, top: 6, bottom: 6,
              width: 18, zIndex: 3,
              background: 'rgba(0,0,0,0.55)',
              borderRight: side === 'left'  ? '1px solid rgba(232,213,163,0.1)' : 'none',
              borderLeft:  side === 'right' ? '1px solid rgba(232,213,163,0.1)' : 'none',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'space-evenly',
              padding: '10px 0',
              pointerEvents: 'none',
            }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{
                  width: 9, height: 13, borderRadius: 2,
                  border: '1px solid rgba(232,213,163,0.13)',
                  background: '#020202',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.9)',
                }} />
              ))}
            </div>
          ))}

          {/* ── Video element ── */}
          <video
            ref={videoRef}
            src="https://drive.google.com/uc?id=1gS-kCMpKHeXf1C_KVBWwKgEnTKAv58Kj&export=download"
            playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 1 }}
            onTimeUpdate={e => setCurrentTime(e.target.currentTime)}
            onLoadedMetadata={e => setDuration(e.target.duration)}
            onEnded={() => { setPlaying(false); setShowControls(true); }}
          />

          {/* ── Initial overlay ── */}
          {!started && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'rgba(0,0,0,0.38)' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(232,213,163,0.05)' }}>
                <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, fill: 'var(--gold)', marginLeft: 4 }}>
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
              <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)', margin: 0 }}>Showreel 2025</p>
            </div>
          )}

          {/* ── Custom controls bar ── */}
          {started && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 8,
                padding: '24px 20px 10px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)',
                transform: showControls || !playing ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.3s ease',
              }}
            >
              {/* Progress bar */}
              <div style={{ position: 'relative', height: 3, background: 'rgba(255,255,255,0.15)', marginBottom: 10, cursor: 'pointer' }}>
                {/* Filled */}
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: 'var(--gold)', pointerEvents: 'none' }} />
                {/* Scrubber */}
                <input
                  type="range" min={0} max={duration || 100} step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  style={{
                    position: 'absolute', inset: '-6px 0',
                    width: '100%', height: 'calc(100% + 12px)',
                    opacity: 0, cursor: 'pointer', margin: 0,
                  }}
                />
                {/* Thumb dot */}
                <div style={{
                  position: 'absolute', top: '50%',
                  left: `${progress}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 10, height: 10, borderRadius: '50%',
                  background: 'var(--gold)',
                  boxShadow: '0 0 6px rgba(232,213,163,0.6)',
                  pointerEvents: 'none',
                }} />
              </div>

              {/* Controls row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Play / Pause */}
                <button onClick={togglePlay} style={btnStyle}>
                  {playing
                    ? <svg viewBox="0 0 24 24" style={iconStyle}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    : <svg viewBox="0 0 24 24" style={iconStyle}><polygon points="5,3 19,12 5,21"/></svg>
                  }
                </button>

                {/* Time */}
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(245,240,232,0.55)', whiteSpace: 'nowrap' }}>
                  {fmt(currentTime)} / {fmt(duration)}
                </span>

                <div style={{ flex: 1 }} />

                {/* Mute */}
                <button onClick={toggleMute} style={btnStyle}>
                  {muted
                    ? <svg viewBox="0 0 24 24" style={iconStyle} fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                    : <svg viewBox="0 0 24 24" style={iconStyle} fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  }
                </button>

                {/* Fullscreen */}
                <button onClick={handleFullscreen} style={btnStyle}>
                  <svg viewBox="0 0 24 24" style={iconStyle} fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,3 21,3 21,9"/><polyline points="9,21 3,21 3,15"/>
                    <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const btnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'rgba(245,240,232,0.75)', padding: 4, display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  transition: 'color 0.2s',
};
const iconStyle = { width: 18, height: 18, fill: 'currentColor' };
