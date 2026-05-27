import React, { useState } from 'react';
import App from './App';

export const LoadingGate = () => {
  const [done, setDone] = useState(false);

  return (
    <>
      {!done && (
        <div style={{
          position: 'fixed', inset: 0,
          background: '#000',
          zIndex: 9999,
        }}>
          <video
            src="/loading.mp4"
            autoPlay
            muted
            playsInline
            onEnded={() => setDone(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      )}

      <div style={{
        opacity: done ? 1 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: done ? 'all' : 'none',
      }}>
        <App />
      </div>
    </>
  );
};
