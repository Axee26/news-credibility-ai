/**
 * utils/index.js
 * 공통 유틸리티 함수
 */

/**
 * 신뢰도 점수 → 등급/색상/설명 변환
 * DRD §2.5.2: 70↑ 신뢰 / 40~69 주의 / 39↓ 불신
 */
export const getTrustLevel = (score) => {
  if (score >= 70) return {
    level: 'high',
    label: '신뢰',
    color: '#16a34a',
    bg: '#dcfce7',
    description: '신뢰할 수 있는 뉴스로 판단됩니다.',
    icon: '✓',
  };
  if (score >= 40) return {
    level: 'mid',
    label: '주의',
    color: '#d97706',
    bg: '#fef3c7',
    description: '일부 내용을 주의 깊게 확인할 필요가 있습니다.',
    icon: '!',
  };
  return {
    level: 'low',
    label: '불신',
    color: '#dc2626',
    bg: '#fee2e2',
    description: '가짜뉴스일 가능성이 높습니다. 교차 확인을 권장합니다.',
    icon: '✕',
  };
};

/**
 * 퍼센트 값 → 위험도 레이블
 */
export const getRiskLabel = (value) => {
  if (value >= 70) return { label: '높음', color: '#dc2626' };
  if (value >= 40) return { label: '보통', color: '#d97706' };
  return { label: '낮음', color: '#16a34a' };
};

/**
 * 날짜 포맷 (YYYY.MM.DD HH:mm)
 */
export const formatDate = (isoString) => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/**
 * 텍스트 말줄임
 */
export const truncate = (str, len = 80) => {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
};

/**
 * 숫자 반올림 포맷
 */
export const fmtPct = (val) => `${Math.round(val)}%`;
export const fmtScore = (val) => Math.round(val);

/**
 * 클립보드 복사
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
};

/**
 * 모의 분석 결과 (API 미연결 시 데모용)
 * - 실제 배포 시 삭제
 */
export const getMockResult = (text) => {
  const seed = text.length % 100;
  const sourceScore    = 40 + seed * 0.4;
  const exaggeration   = Math.max(5, 80 - seed * 0.6);
  const aiSuspicion    = Math.max(5, 60 - seed * 0.3);
  const totalScore     = Math.round(
    sourceScore * 0.4 + (100 - exaggeration) * 0.35 + (100 - aiSuspicion) * 0.25
  );

  return {
    totalScore,
    metrics: {
      sourceCredibility:  Math.round(sourceScore),
      exaggeration:       Math.round(exaggeration),
      aiSuspicion:        Math.round(aiSuspicion),
    },
    similarArticles: [
      {
        id: 1,
        title: '연합뉴스: 관련 기사 제목이 여기에 표시됩니다',
        source: '연합뉴스',
        url: 'https://www.yna.co.kr',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        similarity: 87,
      },
      {
        id: 2,
        title: 'KBS뉴스: 동일 이슈 관련 보도 제목',
        source: 'KBS 뉴스',
        url: 'https://news.kbs.co.kr',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        similarity: 74,
      },
      {
        id: 3,
        title: '조선일보: 해당 사안에 대한 보도',
        source: '조선일보',
        url: 'https://www.chosun.com',
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        similarity: 61,
      },
    ],
    reasoning: [
      sourceScore >= 60
        ? '공신력 있는 언론사에서 해당 내용을 보도한 기록이 확인됩니다.'
        : '공신력 있는 언론사의 보도가 확인되지 않습니다.',
      exaggeration >= 60
        ? '텍스트에서 감정적·과장된 표현이 다수 감지되었습니다.'
        : '텍스트의 언어 표현이 비교적 중립적입니다.',
      aiSuspicion >= 60
        ? 'AI 생성 텍스트의 특징 패턴이 일부 감지되었습니다.'
        : 'AI 생성 텍스트 패턴이 크게 감지되지 않습니다.',
    ],
    analyzedAt: new Date().toISOString(),
  };
};
