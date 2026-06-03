/**
 * pages/AboutPage.jsx
 * 서비스 소개 페이지
 */

import React from 'react';
import { Link } from 'react-router-dom';

const TECH_STACK = [
  { name: 'KoELECTRA', role: 'NLP 분류 모델', desc: '한국어 특화 경량 모델, 가짜뉴스 텍스트 분류', color: '#1a4fd6' },
  { name: 'Sentence-BERT', role: '유사도 분석', desc: '문장 임베딩으로 유사 기사 검색', color: '#7c3aed' },
  { name: 'NAVER News API', role: '출처 검증', desc: '실시간 기사 수집 및 언론사 신뢰도 검증', color: '#03c75a' },
  { name: 'FastAPI', role: 'AI 서버', desc: 'Python AI 모델 REST API 제공', color: '#009688' },
  { name: 'Spring Boot', role: '메인 서버', desc: '전체 시스템 제어, 사용자 관리, 이력 저장', color: '#6db33f' },
  { name: 'React.js', role: '프론트엔드', desc: '신뢰도 대시보드 및 결과 시각화', color: '#61dafb' },
];

const SCORE_GUIDE = [
  { range: '70 ~ 100점', label: '신뢰', color: '#16a34a', bg: '#dcfce7', desc: '공신력 있는 언론사 보도 확인, 과장 표현 적음, AI 생성 의심 낮음' },
  { range: '40 ~ 69점', label: '주의', color: '#d97706', bg: '#fef3c7', desc: '일부 지표에서 주의 필요. 내용을 교차 확인하는 것을 권장합니다.' },
  { range: '0 ~ 39점',  label: '불신', color: '#dc2626', bg: '#fee2e2', desc: '가짜뉴스 가능성 높음. 반드시 원출처를 직접 확인하세요.' },
];

const AboutPage = () => (
  <main style={{ padding: '48px 0 80px' }}>
    <div className="container" style={{ maxWidth: 800 }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid var(--border-default)' }}>
        <div className="badge badge-info" style={{ marginBottom: 16, display: 'inline-flex' }}>
          AI 기반 뉴스 신뢰도 평가 플랫폼
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.3, marginBottom: 16 }}>
          왜 NewsCheck인가?
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          생성형 AI의 발전으로 사실과 구분하기 어려운 허위정보 생산이 용이해졌습니다.
          기존 팩트체크 서비스는 수동 검증에 의존해 속도가 느리고 커버리지가 제한적입니다.
          NewsCheck는 <strong>KoELECTRA + Sentence-BERT + NAVER News API</strong>를 결합하여
          한국어 뉴스를 실시간으로 다차원 분석합니다.
        </p>
      </div>

      {/* 점수 가이드 */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>신뢰도 점수 기준</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SCORE_GUIDE.map(g => (
            <div key={g.range} style={{
              display: 'flex', gap: 16, padding: '18px 20px',
              borderRadius: 'var(--radius-md)',
              background: g.bg, border: `1px solid ${g.color}20`,
            }}>
              <div style={{
                flexShrink: 0, minWidth: 90,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: g.color }}>{g.label}</span>
                <span style={{ fontSize: 12, color: g.color, opacity: 0.7 }}>{g.range}</span>
              </div>
              <div style={{ borderLeft: `2px solid ${g.color}40`, paddingLeft: 16 }}>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 12, lineHeight: 1.6 }}>
          ※ 본 점수는 AI 참고용이며 최종 판단 책임은 사용자에게 있습니다. 100% 정확도를 보장하지 않습니다.
        </p>
      </section>

      {/* 분석 지표 */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>3가지 분석 지표</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { icon: '🏛️', label: '출처 신뢰도', desc: '공신력 있는 언론사(방통위·한국신문협회 인증) 화이트리스트를 기준으로 해당 뉴스의 보도 여부를 실시간 확인합니다.' },
            { icon: '📢', label: '문장 과장성', desc: '감정적·자극적 언어 패턴을 NLP로 분석합니다. 높을수록 선정적 표현이 많음을 의미합니다.' },
            { icon: '🤖', label: 'AI 생성 의심도', desc: 'AI가 생성한 텍스트에서 나타나는 특징 패턴을 KoELECTRA로 탐지합니다.' },
          ].map(m => (
            <div key={m.label} style={{
              padding: '20px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{m.label}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 기술 스택 */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>기술 스택</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {TECH_STACK.map(t => (
            <div key={t.name} style={{
              display: 'flex', gap: 12, padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
            }}>
              <div style={{
                width: 8, borderRadius: 99,
                background: t.color, flexShrink: 0,
              }} />
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</span>
                  <span style={{
                    fontSize: 11, color: t.color, fontWeight: 600,
                    background: `${t.color}18`, padding: '1px 8px', borderRadius: 99,
                  }}>
                    {t.role}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 제한 사항 */}
      <section style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-sunken)',
        padding: '24px 28px',
        marginBottom: 48,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>⚠️ 이용 시 유의 사항</h2>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            '본 서비스는 참고 도구이며 100% 정확도를 보장하지 않습니다.',
            '분석 결과를 근거로 특정 기사나 언론사를 단정짓지 마세요.',
            '최종 판단 책임은 항상 사용자 본인에게 있습니다.',
            '정치적 편향 없는 언론사 DB를 구성하였으나, 지속적으로 업데이트 중입니다.',
            '개인정보 보호를 위해 입력 텍스트는 분석 후 즉시 삭제됩니다.',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <span style={{ color: 'var(--brand-primary)', flexShrink: 0 }}>•</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* 팀 정보 */}
      <section style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.8, marginBottom: 24 }}>
          <strong style={{ color: 'var(--text-secondary)' }}>팀폴6</strong> · 종합설계(MIDAS) ·
          영남대학교 · v1.0 · 2026년 5월 제출
        </div>
        <Link
          to="/analyze"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--brand-primary)',
            color: 'white', fontWeight: 700, fontSize: 14,
          }}
        >
          지금 분석해보기 →
        </Link>
      </section>
    </div>
  </main>
);

export default AboutPage;
