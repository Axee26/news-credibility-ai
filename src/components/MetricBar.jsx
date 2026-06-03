/**
 * components/MetricBar.jsx
 * 개별 지표 바 (출처신뢰도 / 과장성 / AI생성의심도)
 */

import React, { useEffect, useRef } from 'react';
import { getRiskLabel } from '../utils';

const MetricBar = ({ label, value, description, inverted = false, icon, delay = 0 }) => {
  const barRef = useRef(null);

  // inverted: 값이 낮을수록 좋은 지표 (과장성, AI의심도)
  const displayValue = value;
  const { label: riskLabel, color } = inverted
    ? getRiskLabel(value)
    : (value >= 60
        ? { label: '높음', color: '#16a34a' }
        : value >= 30
          ? { label: '보통', color: '#d97706' }
          : { label: '낮음', color: '#dc2626' });

  const barColor = inverted
    ? (value >= 60 ? '#dc2626' : value >= 30 ? '#d97706' : '#16a34a')
    : (value >= 60 ? '#16a34a' : value >= 30 ? '#d97706' : '#dc2626');

  useEffect(() => {
    if (!barRef.current) return;
    const el = barRef.current;
    el.style.width = '0%';
    const timer = setTimeout(() => {
      el.style.transition = 'width 900ms cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.width = `${value}%`;
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-default)' }}>
      {/* 헤더 행 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && (
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--bg-sunken)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>
              {icon}
            </div>
          )}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              {label}
            </div>
            {description && (
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>
                {description}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 20, fontWeight: 700, color: barColor,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {Math.round(value)}%
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: barColor,
            background: `${barColor}18`,
            padding: '2px 8px',
            borderRadius: 99,
          }}>
            {riskLabel}
          </span>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div style={{
        height: 8,
        background: 'var(--bg-sunken)',
        borderRadius: 99,
        overflow: 'hidden',
      }}>
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: 0,
            borderRadius: 99,
            background: barColor,
          }}
        />
      </div>
    </div>
  );
};

export default MetricBar;
