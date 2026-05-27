import React from 'react';
import { C } from '../utils/colors';

const W      = 680;
const H      = 460;
const ARM_H  = 140;
const BODY_H = H - ARM_H;
const HX     = 16;   // hinge x
const HY     = ARM_H / 2;  // hinge y

const LABEL = {
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'rgba(232,213,163,0.42)',
  lineHeight: 1,
  marginBottom: 6,
};

const VALUE = {
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: 18,
  fontWeight: 400,
  letterSpacing: '0.06em',
  color: C.offWhite,
  lineHeight: 1,
};

function Field({ label, value, opacity, scale, glow }) {
  return (
    <div style={{ opacity, transform: `scale(${scale})`, transformOrigin: 'left center' }}>
      <div style={LABEL}>{label}</div>
      <div style={{
        ...VALUE,
        textShadow: glow > 0.04
          ? `0 0 14px rgba(255,255,255,${glow}), 0 0 28px rgba(232,213,163,${glow * 0.6})`
          : 'none',
      }}>
        {value}
      </div>
    </div>
  );
}

function Bolt({ x, y }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9}
        fill="url(#bolt-fill)"
        stroke="rgba(255,255,255,0.08)" strokeWidth={1}
      />
      <circle cx={x - 1} cy={y - 1} r={3}
        fill="rgba(255,255,255,0.06)"
      />
    </g>
  );
}

export function Clapperboard({
  armAngle   = 0,
  textFields,
  boardShakeX = 0,
  boardRecoilY = 0,
  boardScale  = 1,
  boardOpacity = 1,
  rotate      = -2,
  translateY  = 0,
}) {
  return (
    <div style={{
      position: 'absolute',
      top: '50%', left: '50%',
      transform: `translate(calc(-50% + ${boardShakeX}px), calc(-50% + ${translateY + boardRecoilY}px)) rotate(${rotate}deg) scale(${boardScale})`,
      opacity: boardOpacity,
      width: W,
      height: H,
      willChange: 'transform, opacity',
      filter: [
        'drop-shadow(0 50px 100px rgba(0,0,0,0.98))',
        'drop-shadow(0 12px 30px rgba(0,0,0,0.9))',
        'drop-shadow(0 0 80px rgba(232,213,163,0.07))',
      ].join(' '),
    }}>

      {/* ── BOARD SVG — body shape, stripes, bolts ── */}
      <svg
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', top: 0, left: 0, display: 'block' }}
      >
        <defs>
          {/* Diagonal stripe pattern — black + gold */}
          <pattern
            id="cp-stripe" patternUnits="userSpaceOnUse"
            width="56" height="56"
            patternTransform="rotate(-45 0 0)"
          >
            <rect x="0"  y="0" width="28" height="56" fill="#0c0c0c"/>
            <rect x="28" y="0" width="28" height="56" fill="#E8D5A3"/>
          </pattern>

          {/* Board body gradient */}
          <linearGradient id="body-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1e1e1e"/>
            <stop offset="60%"  stopColor="#141414"/>
            <stop offset="100%" stopColor="#0c0c0c"/>
          </linearGradient>

          {/* Left edge bevel */}
          <linearGradient id="bevel-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="rgba(255,255,255,0.09)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0.0)"/>
          </linearGradient>

          {/* Top edge bevel */}
          <linearGradient id="bevel-t" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(255,255,255,0.09)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0.0)"/>
          </linearGradient>

          {/* Bolt gradient */}
          <radialGradient id="bolt-fill" cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#484848"/>
            <stop offset="100%" stopColor="#0c0c0c"/>
          </radialGradient>

          {/* Arm shadow cast on body */}
          <linearGradient id="arm-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.75)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0.0)"/>
          </linearGradient>

          {/* Clip for board corners */}
          <clipPath id="board-clip">
            <rect x="0" y="0" width={W} height={H} rx="4" ry="4"/>
          </clipPath>

          {/* Clip for arm corners */}
          <clipPath id="arm-clip">
            <rect x="0" y="0" width={W} height={ARM_H} rx="4" ry="4"/>
          </clipPath>
        </defs>

        {/* Board background */}
        <rect x="0" y="0" width={W} height={H} rx="4" fill="url(#body-grad)" clipPath="url(#board-clip)"/>

        {/* Stripe section (behind arm, shows when arm rises) */}
        <rect x="0" y="0" width={W} height={ARM_H} fill="url(#cp-stripe)" clipPath="url(#board-clip)"/>

        {/* Arm/body separator */}
        <line x1="0" y1={ARM_H} x2={W} y2={ARM_H} stroke="#080808" strokeWidth="4"/>

        {/* Arm shadow on body (opacity tied to arm open angle) */}
        <rect
          x="0" y={ARM_H} width={W} height={56}
          fill="url(#arm-shadow)"
          opacity={armAngle / 45}
        />

        {/* Board border */}
        <rect x="0" y="0" width={W} height={H} rx="4" fill="none" stroke="#252525" strokeWidth="3"/>

        {/* Edge bevels */}
        <rect x="0" y="0" width="3" height={H} fill="url(#bevel-l)"/>
        <rect x="0" y="0" width={W} height="2" fill="url(#bevel-t)"/>

        {/* Dividers in text section */}
        {/* Horizontal line after PRODUCTION */}
        <line x1="22" y1={ARM_H + 58} x2={W - 22} y2={ARM_H + 58}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        {/* Mid vertical divider */}
        <line x1={W / 2} y1={ARM_H + 62} x2={W / 2} y2={H - 10}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        {/* Horizontal row dividers */}
        <line x1="22" y1={ARM_H + 128} x2={W - 22} y2={ARM_H + 128}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <line x1="22" y1={ARM_H + 198} x2={W - 22} y2={ARM_H + 198}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

        {/* Corner bolts */}
        <Bolt x={10}     y={10}     />
        <Bolt x={W - 10} y={10}     />
        <Bolt x={10}     y={H - 10} />
        <Bolt x={W - 10} y={H - 10} />

        {/* ── CLAPPER ARM ── */}
        <g
          transform={`rotate(${-armAngle}, ${HX}, ${HY})`}
          style={{ filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.85))' }}
        >
          {/* Arm stripes */}
          <rect x="0" y="0" width={W} height={ARM_H} fill="url(#cp-stripe)" clipPath="url(#arm-clip)"/>

          {/* Arm border */}
          <rect x="0" y="0" width={W} height={ARM_H} rx="4" fill="none" stroke="#111" strokeWidth="3"/>

          {/* Top edge highlight on arm */}
          <rect x="2" y="2" width={W - 4} height="2" rx="1" fill="rgba(255,255,255,0.1)"/>

          {/* Bottom shadow on arm */}
          <rect x="0" y={ARM_H - 12} width={W} height="12"
            fill="url(#arm-shadow)" opacity="0.8"
            clipPath="url(#arm-clip)"
          />

          {/* Hinge outer ring */}
          <circle cx={HX} cy={HY} r={14}
            fill="url(#bolt-fill)"
            stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"
          />
          {/* Hinge inner ring */}
          <circle cx={HX} cy={HY} r={6}
            fill="radial-gradient(#222,#0a0a0a)"
            stroke="rgba(255,255,255,0.08)" strokeWidth="1"
          />
          {/* Hinge center dot */}
          <circle cx={HX} cy={HY} r={2.5} fill="#1a1a1a"/>

          {/* Hinge highlight */}
          <circle cx={HX - 3} cy={HY - 3} r={3} fill="rgba(255,255,255,0.08)"/>
        </g>
      </svg>

      {/* ── TEXT FIELDS (HTML overlay) ── */}
      {textFields && (
        <div style={{
          position: 'absolute',
          top: ARM_H + 6,
          left: 0,
          width: W,
          height: BODY_H - 6,
          padding: '12px 22px 10px',
          boxSizing: 'border-box',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '52px 66px 66px 66px',
          rowGap: 0,
          columnGap: 12,
        }}>
          {/* PRODUCTION — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <Field {...textFields[0]} />
          </div>
          {/* DIRECTOR */}
          <div><Field {...textFields[1]} /></div>
          {/* CAMERA */}
          <div><Field {...textFields[2]} /></div>
          {/* DATE */}
          <div><Field {...textFields[3]} /></div>
          {/* SCENE */}
          <div><Field {...textFields[4]} /></div>
          {/* TAKE */}
          <div><Field {...textFields[5]} /></div>
          {/* ROLL */}
          <div><Field {...textFields[6]} /></div>
        </div>
      )}
    </div>
  );
}
