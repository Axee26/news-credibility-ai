/**
 * components/AnalysisResult.jsx
 * 분석 결과 전체 표시 컴포넌트
 */

import React, { useState } from 'react';
import ScoreGauge from './ScoreGauge';
import MetricBar from './MetricBar';
import ArticleCard from './ArticleCard';
import { getTrustLevel, copyToClipboard, formatDate } from '../utils';

const AnalysisResult = ({ result, inputText, onReset }) => {
  const [copied, setCopied] = useState(false);
  const { totalScore, metrics, similarArticles, reasoning, analyzedAt } = result;
  const trust = getTrustLevel(totalScore);

  const handleCopy = async () => {
    const text = `[뉴스 신뢰도 분석 결과]
분석일시: ${formatDate(analyzedAt)}
종합 점수: ${totalScore}점 (${trust.label})
출처 신뢰도: ${metrics.sourceCredibility}%
과장성: ${metrics.exaggeration}%
AI 생성 의심도: ${metrics.aiSuspicion}%

판단 근거:
${reasoning?.map((r, i) => `${i+1}. ${r}`).join('\n')}

분석 텍스트:
${inputText}`;
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ animation: 'fadeUp 400ms ease both' }}>
      {/* 상단 요약 배너 */}
      <div style={{
        borderRadius: 'var(--radius-lg)',
        background: trust.bg,
        border: `1px solid ${trust.color}30`,
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{ fontSize: 32 }}>
          {trust.level === 'high' ? '✅' : trust.level === 'mid' ? '⚠️' : '🚫'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: trust.color }}>
            {trust.label} 뉴스
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 3 }}>
            {trust.description}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: trust.color }}>
            {Math.round(totalScore)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>/ 100점</div>
        </div>
      </div>

      {/* 메인 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20, marginBottom: 24 }}>

        {/* 점수 게이지 */}
        <div style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          background: 'var(--bg-surface)',
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
            종합 신뢰도 점수
          </div>
          <ScoreGauge score={totalScore} size={180} />
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6, textAlign: 'center', lineHeight: 1.6 }}>
            70점↑ 신뢰 · 40~69점 주의 · 39점↓ 불신
          </div>
        </div>

        {/* 세부 지표 */}
        <div style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          background: 'var(--bg-surface)',
          padding: '20px 24px',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
            세부 분석 지표
          </div>
          <MetricBar
            label="출처 신뢰도"
            value={metrics.sourceCredibility}
            description="공신력 있는 언론사 보도 여부"
            icon="🏛️"
            inverted={false}
            delay={0}
          />
          <MetricBar
            label="문장 과장성"
            value={metrics.exaggeration}
            description="감정적·자극적 언어 비율"
            icon="📢"
            inverted={true}
            delay={150}
          />
          <MetricBar
            label="AI 생성 의심도"
            value={metrics.aiSuspicion}
            description="텍스트 패턴 기반 AI 생성 가능성"
            icon="🤖"
            inverted={true}
            delay={300}
          />
        </div>
      </div>

      {/* 판단 근거 */}
      {reasoning && reasoning.length > 0 && (
        <div style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          background: 'var(--bg-surface)',
          padding: '20px 24px',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16 }}>
            📋 판단 근거
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reasoning.map((r, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-sunken)',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--brand-primary)',
                  color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {r}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 유사 기사 */}
      {similarArticles && similarArticles.length > 0 && (
        <div style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          background: 'var(--bg-surface)',
          padding: '20px 24px',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16 }}>
            🔍 유사 기사 목록 ({similarArticles.length}건)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {similarArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* 주의 사항 */}
      <div style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-sunken)',
        padding: '14px 18px',
        marginBottom: 24,
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          본 분석 결과는 AI 기반 참고 정보로, 최종 판단 책임은 사용자에게 있습니다.
          100% 정확도를 보장하지 않으며, 중요한 정보는 반드시 공신력 있는 출처를 교차 확인하세요.
        </p>
      </div>

      {/* 액션 버튼 */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onReset}
          style={{
            flex: 1, padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            fontSize: 14, fontWeight: 600,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
        >
          🔄 새로 분석
        </button>
        <button
          onClick={handleCopy}
          style={{
            flex: 1, padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--brand-primary)',
            background: copied ? 'var(--trust-high-bg)' : 'var(--brand-primary-light)',
            fontSize: 14, fontWeight: 600,
            color: copied ? 'var(--trust-high)' : 'var(--brand-primary)',
            cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
        >
          {copied ? '✓ 복사됨' : '📋 결과 복사'}
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
