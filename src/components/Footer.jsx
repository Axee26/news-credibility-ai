/**
 * components/Footer.jsx
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{
    borderTop: '1px solid var(--border-default)',
    background: 'var(--bg-surface)',
    padding: '40px 0 24px',
    marginTop: 'auto',
  }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 32, marginBottom: 40 }}>
        {/* 브랜드 */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>NewsCheck</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
            AI 기반 뉴스 신뢰도 평가 플랫폼<br/>
            한국어 특화 가짜뉴스 탐지 시스템
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            KoELECTRA · Sentence-BERT · NAVER News API
          </div>
        </div>

        {/* 서비스 */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>서비스</div>
          {['뉴스 분석', '분석 기록', '서비스 소개', 'API 문서'].map(item => (
            <div key={item} style={{ marginBottom: 8 }}>
              <Link to="#" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item}</Link>
            </div>
          ))}
        </div>

        {/* 정보 */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>정보</div>
          {['이용약관', '개인정보처리방침', '오픈소스 라이선스'].map(item => (
            <div key={item} style={{ marginBottom: 8 }}>
              <Link to="#" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item}</Link>
            </div>
          ))}
        </div>

        {/* 팀 */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>팀폴6</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            종합설계 (MIDAS)<br/>
            영남대학교
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginTop: 10, fontSize: 13, color: 'var(--brand-primary)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--border-default)',
        paddingTop: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          © 2026 팀폴6 — 종합설계 MIDAS 프로젝트. All rights reserved.
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          본 결과는 AI 참고용이며 최종 판단은 사용자에게 있습니다.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
