/**
 * components/ArticleCard.jsx
 * 유사 기사 카드 컴포넌트
 */

import React from 'react';
import { formatDate, truncate } from '../utils';

const ArticleCard = ({ article }) => {
  const { title, source, url, publishedAt, similarity } = article;

  const simColor = similarity >= 75
    ? '#16a34a'
    : similarity >= 50
      ? '#d97706'
      : '#94a3b8';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        padding: '14px 16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-surface)',
        textDecoration: 'none',
        transition: 'all var(--transition)',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--brand-primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        {/* 기사 정보 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: 'var(--brand-primary)', fontWeight: 600, marginBottom: 4 }}>
            {source}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>
            {truncate(title, 80)}
          </div>
          {publishedAt && (
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
              {formatDate(publishedAt)}
            </div>
          )}
        </div>

        {/* 유사도 */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#e2e8f0" strokeWidth="4"/>
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke={simColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={125.66}
              strokeDashoffset={125.66 - (similarity / 100) * 125.66}
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
            <text
              x="24" y="24"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={simColor}
              fontSize="11"
              fontWeight="700"
              fontFamily="'Noto Sans KR', sans-serif"
            >
              {similarity}%
            </text>
          </svg>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>유사도</span>
        </div>
      </div>

      {/* 외부 링크 아이콘 */}
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-tertiary)' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7M7 1h4m0 0v4m0-4L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: 11 }}>원문 보기</span>
      </div>
    </a>
  );
};

export default ArticleCard;
