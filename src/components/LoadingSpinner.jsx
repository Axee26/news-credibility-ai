/**
 * components/LoadingSpinner.jsx
 * 분석 진행 중 로딩 UI
 */

import React from 'react';

const STEPS = [
  { label: 'KoELECTRA 모델 로드 중', threshold: 10 },
  { label: '텍스트 전처리 및 토크나이징', threshold: 25 },
  { label: 'NLP 분석 실행 중', threshold: 45 },
  { label: 'NAVER News API 출처 검증', threshold: 65 },
  { label: 'Sentence-BERT 유사도 분석', threshold: 80 },
  { label: '종합 점수 산출 중', threshold: 95 },
];

const LoadingSpinner = ({ progress = 0 }) => {
  const currentStepIndex = STEPS.findIndex(s => progress < s.threshold);
  const currentStep = STEPS[currentStepIndex < 0 ? STEPS.length - 1 : currentStepIndex];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 24px',
      gap: 28,
      animation: 'fadeIn 300ms ease both',
    }}>
      {/* 애니메이션 아이콘 */}
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--bg-sunken)" strokeWidth="5"/>
          <circle
            cx="40" cy="40" r="34"
            fill="none"
            stroke="var(--brand-primary)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={213.6}
            strokeDashoffset={213.6 - (progress / 100) * 213.6}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              transition: 'stroke-dashoffset 400ms ease',
            }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: 'var(--brand-primary)',
        }}>
          {Math.round(progress)}%
        </div>
      </div>

      {/* 현재 단계 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>
          분석 중…
        </div>
        <div style={{
          fontSize: 13, color: 'var(--text-secondary)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          {currentStep?.label}
        </div>
      </div>

      {/* 스텝 인디케이터 */}
      <div style={{ display: 'flex', gap: 6 }}>
        {STEPS.map((step, i) => {
          const done = progress >= step.threshold;
          const active = i === currentStepIndex;
          return (
            <div key={i} style={{
              width: active ? 20 : 6,
              height: 6,
              borderRadius: 99,
              background: done
                ? 'var(--brand-primary)'
                : active
                  ? 'var(--brand-primary)'
                  : 'var(--border-default)',
              opacity: done ? 1 : active ? 0.7 : 0.4,
              transition: 'all 300ms ease',
            }} />
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center' }}>
        평균 10~30초 소요됩니다
      </p>
    </div>
  );
};

export default LoadingSpinner;
