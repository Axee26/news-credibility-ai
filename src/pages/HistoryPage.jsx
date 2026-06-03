/**
 * pages/HistoryPage.jsx
 * 분석 기록 페이지
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from '../hooks';
import { formatDate, truncate, getTrustLevel } from '../utils';

const HistoryItem = ({ item, onDelete }) => {
  const trust = getTrustLevel(item.totalScore);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('이 분석 기록을 삭제하시겠습니까?')) return;
    setDeleting(true);
    try {
      await onDelete(item.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{
      padding: '18px 20px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      background: 'var(--bg-surface)',
      transition: 'all var(--transition)',
      animation: 'fadeUp 300ms ease both',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        {/* 내용 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 10px', borderRadius: 99,
              background: trust.bg, color: trust.color,
              fontSize: 12, fontWeight: 700,
            }}>
              {trust.icon} {trust.label}
            </span>
            <span style={{
              fontSize: 18, fontWeight: 800, color: trust.color,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {Math.round(item.totalScore)}점
            </span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 10 }}>
            {truncate(item.inputText || '', 120)}
          </p>

          {/* 세부 지표 미니 바 */}
          {item.metrics && (
            <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
              {[
                { label: '출처', value: item.metrics.sourceCredibility, invert: false },
                { label: '과장성', value: item.metrics.exaggeration, invert: true },
                { label: 'AI의심', value: item.metrics.aiSuspicion, invert: true },
              ].map(({ label, value, invert }) => {
                const color = invert
                  ? (value >= 60 ? '#dc2626' : value >= 30 ? '#d97706' : '#16a34a')
                  : (value >= 60 ? '#16a34a' : value >= 30 ? '#d97706' : '#dc2626');
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</span>
                    <div style={{ width: 48, height: 4, background: 'var(--bg-sunken)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color }}>{Math.round(value)}%</span>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            {formatDate(item.analyzedAt || item.createdAt)}
          </div>
        </div>

        {/* 삭제 버튼 */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            fontSize: 12,
            flexShrink: 0,
          }}
          title="삭제"
        >
          🗑
        </button>
      </div>
    </div>
  );
};

const HistoryPage = () => {
  const token = localStorage.getItem('accessToken');
  const { items, loading, hasMore, loadMore, deleteItem } = useHistory();

  if (!token) {
    return (
      <main style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>로그인이 필요합니다</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 14 }}>
            분석 기록을 저장하고 조회하려면 로그인하세요.
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-block',
              padding: '11px 28px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-primary)',
              color: 'white', fontWeight: 700, fontSize: 14,
            }}
          >
            로그인하기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>분석 기록</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              내가 분석한 뉴스 기록 목록입니다.
            </p>
          </div>
          <Link
            to="/analyze"
            style={{
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-primary)',
              color: 'white', fontWeight: 600, fontSize: 13,
            }}
          >
            + 새 분석
          </Link>
        </div>

        {items.length === 0 && !loading ? (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-strong)',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              아직 분석 기록이 없습니다.<br/>뉴스를 분석해보세요!
            </p>
            <Link to="/analyze" style={{ color: 'var(--brand-primary)', fontWeight: 600, fontSize: 14, display: 'inline-block', marginTop: 16 }}>
              뉴스 분석하러 가기 →
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map(item => (
                <HistoryItem key={item.id} item={item} onDelete={deleteItem} />
              ))}
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)', fontSize: 13 }}>
                불러오는 중…
              </div>
            )}

            {hasMore && !loading && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button
                  onClick={() => loadMore()}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-surface)',
                    fontSize: 13, fontWeight: 600,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  더 보기
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default HistoryPage;
