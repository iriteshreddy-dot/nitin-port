import { useCurrentFrame } from 'remotion';

export const FilmGrain = ({ opacity = 0.055 }) => {
  const frame = useCurrentFrame();
  const seed  = Math.floor(frame / 4) % 8;
  const id    = `fg-${seed}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        opacity,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <defs>
        <filter id={id}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="2"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
};
