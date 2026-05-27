import { interpolate, useCurrentFrame } from 'remotion';

export const Vignette = () => {
  const frame = useCurrentFrame();

  // Darkens during arm-rise tension, relaxes slightly after
  const strength = interpolate(
    frame,
    [0, 90, 120, 155, 180],
    [0.65, 0.65, 0.90, 0.75, 0.45],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        zIndex: 99,
        background: `radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,${strength}) 100%)`,
      }}
    />
  );
};
