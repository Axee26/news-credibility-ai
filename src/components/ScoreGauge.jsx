/**
 * components/ScoreGauge.jsx
 * 원형 신뢰도 점수 게이지 (0~100)
 */

import React, { useEffect, useRef } from 'react';
import { getTrustLevel, fmtScore } from '../utils';

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ScoreGauge = ({ score, size = 200, animated = true }) => {
  const circleRef = useRef(null);
  const trust = getTrustLevel(score);

  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  useEffect(() => {
    if (!animated || !circleRef.current) return;
    const el = circleRef.current;
    el.style.strokeDashoffset = CIRCUMFERENCE;
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.strokeDashoffset = offset;
    });
  }, [score, offset, animated]);

  const cx = size / 2;
  const cy = size / 2;
  const r  = (size / 200) * RADIUS;
  const circ = 2 * Math.PI * r;
  const scaledOffset = circ - (score / 100) * circ;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`신뢰도 점수 ${score}점 — ${trust.label}`}
      >
        {/* 배경 트랙 */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={size * 0.06}
        />
        {/* 점수 아크 */}
        <circle
          ref={circleRef}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={trust.color}
          strokeWidth={size * 0.06}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={animated ? circ : scaledOffset}
          style={{
            transformOrigin: 'center',
            transform: 'rotate(-90deg)',
          }}
        />
        {/* 중앙 점수 */}
        <text
          x={cx} y={cy - size * 0.04}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={trust.color}
          fontSize={size * 0.22}
          fontWeight="700"
          fontFamily="'Noto Sans KR', sans-serif"
        >
          {fmtScore(score)}
        </text>
        <text
          x={cx} y={cy + size * 0.14}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#94a3b8"
          fontSize={size * 0.08}
          fontFamily="'Noto Sans KR', sans-serif"
        >
          / 100
        </text>
      </svg>

      {/* 등급 배지 */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 16px',
        borderRadius: 99,
        background: trust.bg,
        color: trust.color,
        fontWeight: 700,
        fontSize: 15,
      }}>
        <span>{trust.icon}</span>
        <span>{trust.label}</span>
      </div>
    </div>
  );
};

export default ScoreGauge;
