import { interpolate, useCurrentFrame } from 'remotion';

// Deterministic seeded random — no Math.random() in render path
function sr(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// 28 particles burst outward from the clap point (top-center of board)
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id:    i,
  angle: -Math.PI + sr(i * 3)     * Math.PI,   // full arc, top-biased
  speed: 2.5 + sr(i * 7 + 1)      * 5.5,
  size:  2   + sr(i * 13 + 2)     * 4,
  delay: Math.floor(sr(i * 17 + 3) * 6),
  drift: (sr(i * 23 + 4) - 0.5)   * 0.5,       // horizontal drift
}));

// Origin: roughly where the clap arm meets the board (cx 50%, cy ~40% of 1080)
const OX = 960;  // px in 1920-wide composition
const OY = 430;  // px

export const DustParticles = () => {
  const frame = useCurrentFrame(); // local 0-20

  return (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 50 }}
      viewBox="0 0 1920 1080"
    >
      {PARTICLES.map(p => {
        const t = Math.max(0, frame - p.delay);
        const progress = interpolate(t, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

        const px = OX + Math.cos(p.angle) * p.speed * t * 14 + p.drift * t * 8;
        const py = OY + Math.sin(p.angle) * p.speed * t * 14 + 0.4 * t * t; // gravity

        const opacity = interpolate(t, [0, 3, 20], [0, 0.75, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });

        return (
          <rect
            key={p.id}
            x={px - p.size / 2}
            y={py - p.size / 2}
            width={p.size}
            height={p.size * 0.6}
            rx={1}
            fill={p.id % 3 === 0 ? '#E8D5A3' : '#F5F0E8'}
            opacity={opacity}
            transform={`rotate(${p.angle * 57.3 + progress * 180}, ${px}, ${py})`}
          />
        );
      })}
    </svg>
  );
};
