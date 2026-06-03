/**
 * pages/HomePage.jsx
 * 메인 랜딩 페이지
 */

import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🏛️',
    title: '출처 신뢰도 검증',
    desc: 'NAVER News API 연동으로 방송통신위원회·한국신문협회 인증 언론사 보도 여부를 실시간 확인합니다.',
  },
  {
    icon: '📊',
    title: '다차원 지표 분석',
    desc: '출처신뢰도(%), 문장과장성(%), AI생성의심도(%) 3가지 지표를 종합해 0~100점 신뢰도를 산출합니다.',
  },
  {
    icon: '🤖',
    title: 'KoELECTRA 기반 NLP',
    desc: '한국어 특화 경량 ELECTRA 모델로 문맥을 정밀 분석합니다. Sentence-BERT로 유사 기사를 탐색합니다.',
  },
  {
    icon: '🔍',
    title: '투명한 판단 근거',
    desc: '단순 판정이 아닌, 유사 기사 목록과 판단 근거를 함께 제공하여 사용자가 직접 검증할 수 있습니다.',
  },
];

const STEPS = [
  { num: '01', title: '뉴스 텍스트 입력', desc: '제목 또는 본문을 최대 2,000자까지 붙여넣기' },
  { num: '02', title: 'AI 자동 분석', desc: 'KoELECTRA + NAVER API 실시간 처리 (30초 이내)' },
  { num: '03', title: '결과 확인', desc: '종합 점수·근거·유사 기사를 한눈에 확인' },
];

const STATS = [
  { value: 'KoELECTRA', label: '한국어 특화 NLP 모델' },
  { value: '0~100점', label: '정밀 신뢰도 점수' },
  { value: '3단계', label: '신뢰 / 주의 / 불신 분류' },
  { value: '30초↓', label: '목표 분석 응답시간' },
];

const HomePage = () => (
  <main>
    {/* Hero */}
    <section style={{
      background: 'linear-gradient(135deg, #f0f4ff 0%, #fafbff 60%, #f0faf6 100%)',
      padding: '80px 0 60px',
      borderBottom: '1px solid var(--border-default)',
    }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
        <div className="badge badge-info" style={{ marginBottom: 20, display: 'inline-flex' }}>
          🎓 종합설계 MIDAS · 팀폴6
        </div>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 800,
          lineHeight: 1.25,
          marginBottom: 20,
          color: 'var(--text-primary)',
        }}>
          AI가 뉴스의 진실을<br/>
          <span style={{ color: 'var(--brand-primary)' }}>투명하게 분석</span>합니다
        </h1>
        <p style={{
          fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36,
        }}>
          KoELECTRA 기반 한국어 NLP 모델과 NAVER News API를 결합하여<br/>
          출처 신뢰도·과장성·AI 생성 의심도를 다차원으로 평가합니다.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/analyze"
            style={{
              padding: '14px 32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-primary)',
              color: 'white',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 4px 16px rgba(26,79,214,0.3)',
            }}
          >
            🔍 뉴스 분석 시작
          </Link>
          <Link
            to="/about"
            style={{
              padding: '14px 32px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            서비스 소개 →
          </Link>
        </div>
      </div>
    </section>

    {/* Stats Bar */}
    <section style={{
      background: 'var(--brand-primary)',
      padding: '24px 0',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '8px 0',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: '72px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 12 }}>핵심 기능</h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            단순 이진 판별을 넘어, 투명한 근거와 함께 제공하는 다차원 분석
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.borderColor = 'var(--brand-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section style={{ padding: '72px 0', background: 'var(--bg-sunken)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 12 }}>사용 방법</h2>
        </div>
        <div style={{ display: 'flex', gap: 0, justifyContent: 'center', maxWidth: 860, margin: '0 auto' }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ flex: 1, textAlign: 'center', padding: '0 20px' }}>
                <div style={{
                  width: 56, height: 56,
                  borderRadius: '50%',
                  background: 'var(--brand-primary)',
                  color: 'white',
                  fontSize: 15, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  color: 'var(--text-tertiary)', fontSize: 24, paddingTop: 0,
                  marginTop: 14,
                }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: '72px 0' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          지금 바로 분석해보세요
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 28 }}>
          의심스러운 뉴스를 붙여넣으면 30초 안에 AI가 신뢰도를 분석합니다.
        </p>
        <Link
          to="/analyze"
          style={{
            display: 'inline-block',
            padding: '15px 40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--brand-primary)',
            color: 'white',
            fontWeight: 700,
            fontSize: 16,
            boxShadow: '0 4px 20px rgba(26,79,214,0.3)',
          }}
        >
          무료로 시작하기 →
        </Link>
      </div>
    </section>
  </main>
);

export default HomePage;
