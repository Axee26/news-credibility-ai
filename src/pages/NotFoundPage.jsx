/**
 * pages/NotFoundPage.jsx
 * 404 페이지
 */

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <main style={{
    minHeight: '70vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center',
  }}>
    <div>
      <div style={{ fontSize: 72, fontWeight: 800, color: 'var(--border-strong)', marginBottom: 16 }}>404</div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>페이지를 찾을 수 없습니다</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '11px 24px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--brand-primary)',
          color: 'white', fontWeight: 600, fontSize: 14,
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  </main>
);

export default NotFoundPage;
