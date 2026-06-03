// /**
//  * pages/AnalyzePage.jsx
//  * 뉴스 분석 메인 페이지
//  */

// import React, { useState } from 'react';
// import { useAnalysis } from '../hooks';
// import LoadingSpinner from '../components/LoadingSpinner';
// import AnalysisResult from '../components/AnalysisResult';
// import { getMockResult } from '../utils';

// const MAX_CHARS = 2000;

// const EXAMPLE_TEXTS = [
//   {
//     label: '예시 1: 정치 뉴스',
//     text: '국회는 오늘 오후 본회의를 열고 2026년도 추가경정예산안을 처리했다. 예산안은 재석 290명 중 찬성 187명, 반대 84명, 기권 19명으로 가결됐다. 정부는 이번 추경을 통해 물가 안정과 민생 지원에 집중 투자할 방침이라고 밝혔다.',
//   },
//   {
//     label: '예시 2: 경제 뉴스',
//     text: '한국은행이 기준금리를 연 3.00%로 0.25%포인트 인하했다. 이창용 총재는 "글로벌 경기 둔화 우려와 국내 소비 부진을 고려한 결정"이라며 추가 인하 가능성도 열어뒀다고 말했다.',
//   },
//   {
//     label: '예시 3: 의심스러운 뉴스',
//     text: '충격!! 정부가 극비리에 모든 국민의 개인정보를 빅테크 기업에 팔아넘겼다는 충격적인 사실이 폭로됐다!!! 관계자에 따르면 수천만 명의 금융정보와 의료기록이 이미 해외로 유출됐을 가능성이 99.9% 확실하다고 한다.',
//   },
// ];

// const AnalyzePage = () => {
//   const [inputText, setInputText] = useState('');
//   const { status, result, error, progress, analyze, reset } = useAnalysis();

//   const handleAnalyze = async () => {
//     // 개발/데모 모드: API 없이 mock 결과
//     if (process.env.REACT_APP_DEMO_MODE === 'true') {
//       // 실제 API 호출 시뮬레이션
//       const { analyze: _analyze, ...rest } = { analyze: null };
//       // mock 처리
//       const mockResult = getMockResult(inputText);
//       // useAnalysis 훅 대신 직접 처리
//       setTimeout(() => {}, 0);
//     }
//     await analyze(inputText);
//   };

//   const handleReset = () => {
//     reset();
//     setInputText('');
//   };

//   const charCount = inputText.length;
//   const isOverLimit = charCount > MAX_CHARS;
//   const canAnalyze = charCount >= 10 && !isOverLimit && status !== 'loading';

//   return (
//     <main style={{ padding: '40px 0 80px' }}>
//       <div className="container" style={{ maxWidth: 820 }}>
//         {/* 페이지 헤더 */}
//         <div style={{ marginBottom: 32 }}>
//           <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>뉴스 신뢰도 분석</h1>
//           <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
//             뉴스 제목 또는 본문을 입력하면 AI가 신뢰도를 분석합니다. (최대 2,000자)
//           </p>
//         </div>

//         {/* 분석 카드 */}
//         {status !== 'success' && (
//           <div style={{
//             borderRadius: 'var(--radius-lg)',
//             border: '1px solid var(--border-default)',
//             background: 'var(--bg-surface)',
//             overflow: 'hidden',
//             boxShadow: 'var(--shadow-sm)',
//             marginBottom: 24,
//           }}>
//             {status === 'loading' ? (
//               <LoadingSpinner progress={progress} />
//             ) : (
//               <>
//                 {/* 텍스트 입력 영역 */}
//                 <div style={{ padding: '20px 24px 0' }}>
//                   <label
//                     htmlFor="news-input"
//                     style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 10 }}
//                   >
//                     뉴스 텍스트 입력
//                   </label>
//                   <textarea
//                     id="news-input"
//                     value={inputText}
//                     onChange={e => setInputText(e.target.value)}
//                     placeholder="분석할 뉴스 제목 또는 본문을 여기에 붙여넣어 주세요..."
//                     rows={10}
//                     style={{
//                       width: '100%',
//                       resize: 'vertical',
//                       padding: '14px',
//                       borderRadius: 'var(--radius-md)',
//                       border: `1px solid ${isOverLimit ? 'var(--trust-low)' : error ? 'var(--trust-low)' : 'var(--border-default)'}`,
//                       background: 'var(--bg-base)',
//                       fontSize: 14,
//                       lineHeight: 1.7,
//                       color: 'var(--text-primary)',
//                       outline: 'none',
//                       transition: 'border-color var(--transition)',
//                       fontFamily: 'var(--font-sans)',
//                     }}
//                     onFocus={e => {
//                       if (!isOverLimit) e.target.style.borderColor = 'var(--brand-primary)';
//                     }}
//                     onBlur={e => {
//                       if (!isOverLimit) e.target.style.borderColor = 'var(--border-default)';
//                     }}
//                   />

//                   {/* 글자 수 카운터 */}
//                   <div style={{
//                     display: 'flex', justifyContent: 'space-between',
//                     alignItems: 'center', marginTop: 8, marginBottom: 16,
//                   }}>
//                     <div>
//                       {error && (
//                         <span style={{ fontSize: 12, color: 'var(--trust-low)' }}>⚠ {error}</span>
//                       )}
//                     </div>
//                     <span style={{
//                       fontSize: 12,
//                       color: isOverLimit ? 'var(--trust-low)' : charCount > MAX_CHARS * 0.8 ? 'var(--trust-mid)' : 'var(--text-tertiary)',
//                       fontVariantNumeric: 'tabular-nums',
//                     }}>
//                       {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}자
//                     </span>
//                   </div>
//                 </div>

//                 {/* 버튼 영역 */}
//                 <div style={{
//                   padding: '16px 24px',
//                   borderTop: '1px solid var(--border-default)',
//                   background: 'var(--bg-base)',
//                   display: 'flex',
//                   gap: 10,
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                 }}>
//                   <button
//                     onClick={() => setInputText('')}
//                     disabled={!inputText}
//                     style={{
//                       padding: '9px 16px',
//                       borderRadius: 'var(--radius-sm)',
//                       border: '1px solid var(--border-default)',
//                       background: 'transparent',
//                       fontSize: 13,
//                       color: 'var(--text-secondary)',
//                       cursor: inputText ? 'pointer' : 'not-allowed',
//                       opacity: inputText ? 1 : 0.4,
//                     }}
//                   >
//                     초기화
//                   </button>
//                   <button
//                     onClick={handleAnalyze}
//                     disabled={!canAnalyze}
//                     style={{
//                       padding: '11px 28px',
//                       borderRadius: 'var(--radius-md)',
//                       border: 'none',
//                       background: canAnalyze ? 'var(--brand-primary)' : 'var(--bg-sunken)',
//                       color: canAnalyze ? 'white' : 'var(--text-tertiary)',
//                       fontWeight: 700,
//                       fontSize: 14,
//                       cursor: canAnalyze ? 'pointer' : 'not-allowed',
//                       transition: 'all var(--transition)',
//                       boxShadow: canAnalyze ? '0 2px 8px rgba(26,79,214,0.25)' : 'none',
//                     }}
//                   >
//                     🔍 신뢰도 분석하기
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {/* 결과 */}
//         {status === 'success' && result && (
//           <AnalysisResult
//             result={result}
//             inputText={inputText}
//             onReset={handleReset}
//           />
//         )}

//         {/* 예시 텍스트 (idle 상태에서만) */}
//         {status === 'idle' && (
//           <div style={{
//             borderRadius: 'var(--radius-lg)',
//             border: '1px solid var(--border-default)',
//             background: 'var(--bg-surface)',
//             padding: '20px 24px',
//           }}>
//             <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14 }}>
//               💡 예시 텍스트로 바로 시험해보기
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {EXAMPLE_TEXTS.map((ex, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setInputText(ex.text)}
//                   style={{
//                     padding: '10px 14px',
//                     borderRadius: 'var(--radius-sm)',
//                     border: '1px solid var(--border-default)',
//                     background: 'var(--bg-base)',
//                     textAlign: 'left',
//                     cursor: 'pointer',
//                     transition: 'all var(--transition)',
//                   }}
//                   onMouseEnter={e => {
//                     e.currentTarget.style.borderColor = 'var(--brand-primary)';
//                     e.currentTarget.style.background = 'var(--brand-primary-light)';
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.borderColor = 'var(--border-default)';
//                     e.currentTarget.style.background = 'var(--bg-base)';
//                   }}
//                 >
//                   <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-primary)', marginBottom: 3 }}>
//                     {ex.label}
//                   </div>
//                   <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
//                     {ex.text.slice(0, 80)}…
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };

// export default AnalyzePage;



/**
 * pages/AnalyzePage.jsx
 * 뉴스 분석 메인 페이지 (로그인 필요)
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAnalysis } from '../hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResult from '../components/AnalysisResult';
import { getMockResult } from '../utils';

const MAX_CHARS = 2000;

const EXAMPLE_TEXTS = [
  {
    label: '예시 1: 정치 뉴스',
    text: '국회는 오늘 오후 본회의를 열고 2026년도 추가경정예산안을 처리했다. 예산안은 재석 290명 중 찬성 187명, 반대 84명, 기권 19명으로 가결됐다. 정부는 이번 추경을 통해 물가 안정과 민생 지원에 집중 투자할 방침이라고 밝혔다.',
  },
  {
    label: '예시 2: 경제 뉴스',
    text: '한국은행이 기준금리를 연 3.00%로 0.25%포인트 인하했다. 이창용 총재는 "글로벌 경기 둔화 우려와 국내 소비 부진을 고려한 결정"이라며 추가 인하 가능성도 열어뒀다고 말했다.',
  },
  {
    label: '예시 3: 의심스러운 뉴스',
    text: '충격!! 정부가 극비리에 모든 국민의 개인정보를 빅테크 기업에 팔아넘겼다는 충격적인 사실이 폭로됐다!!! 관계자에 따르면 수천만 명의 금융정보와 의료기록이 이미 해외로 유출됐을 가능성이 99.9% 확실하다고 한다.',
  },
];

/* ── 로그인 안 됐을 때 보여줄 화면 ── */
const LoginRequired = () => (
  <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
    <div style={{ textAlign: 'center', maxWidth: 420 }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>로그인이 필요합니다</h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
        뉴스 신뢰도 분석 서비스를 이용하려면<br/>로그인 또는 회원가입이 필요합니다.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Link
          to="/login"
          style={{
            padding: '11px 28px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            fontSize: 14, fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          로그인
        </Link>
        <Link
          to="/register"
          style={{
            padding: '11px 28px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--brand-primary)',
            color: 'white',
            fontSize: 14, fontWeight: 700,
          }}
        >
          회원가입
        </Link>
      </div>
    </div>
  </main>
);

/* ── 실제 분석 화면 ── */
const AnalyzeContent = () => {
  const [inputText, setInputText] = useState('');
  const { status, result, error, progress, analyze, reset } = useAnalysis();

  const handleAnalyze = async () => {
    await analyze(inputText);
  };

  const handleReset = () => {
    reset();
    setInputText('');
  };

  const charCount = inputText.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canAnalyze = charCount >= 10 && !isOverLimit && status !== 'loading';

  return (
    <main style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 820 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>뉴스 신뢰도 분석</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            뉴스 제목 또는 본문을 입력하면 AI가 신뢰도를 분석합니다. (최대 2,000자)
          </p>
        </div>

        {status !== 'success' && (
          <div style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 24,
          }}>
            {status === 'loading' ? (
              <LoadingSpinner progress={progress} />
            ) : (
              <>
                <div style={{ padding: '20px 24px 0' }}>
                  <label
                    htmlFor="news-input"
                    style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 10 }}
                  >
                    뉴스 텍스트 입력
                  </label>
                  <textarea
                    id="news-input"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="분석할 뉴스 제목 또는 본문을 여기에 붙여넣어 주세요..."
                    rows={10}
                    style={{
                      width: '100%',
                      resize: 'vertical',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isOverLimit ? 'var(--trust-low)' : error ? 'var(--trust-low)' : 'var(--border-default)'}`,
                      background: 'var(--bg-base)',
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border-color var(--transition)',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onFocus={e => { if (!isOverLimit) e.target.style.borderColor = 'var(--brand-primary)'; }}
                    onBlur={e => { if (!isOverLimit) e.target.style.borderColor = 'var(--border-default)'; }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 16 }}>
                    <div>
                      {error && <span style={{ fontSize: 12, color: 'var(--trust-low)' }}>⚠ {error}</span>}
                    </div>
                    <span style={{
                      fontSize: 12,
                      color: isOverLimit ? 'var(--trust-low)' : charCount > MAX_CHARS * 0.8 ? 'var(--trust-mid)' : 'var(--text-tertiary)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}자
                    </span>
                  </div>
                </div>

                <div style={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--border-default)',
                  background: 'var(--bg-base)',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <button
                    onClick={() => setInputText('')}
                    disabled={!inputText}
                    style={{
                      padding: '9px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-default)',
                      background: 'transparent',
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      cursor: inputText ? 'pointer' : 'not-allowed',
                      opacity: inputText ? 1 : 0.4,
                    }}
                  >
                    초기화
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    style={{
                      padding: '11px 28px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: canAnalyze ? 'var(--brand-primary)' : 'var(--bg-sunken)',
                      color: canAnalyze ? 'white' : 'var(--text-tertiary)',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: canAnalyze ? 'pointer' : 'not-allowed',
                      transition: 'all var(--transition)',
                      boxShadow: canAnalyze ? '0 2px 8px rgba(26,79,214,0.25)' : 'none',
                    }}
                  >
                    🔍 신뢰도 분석하기
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {status === 'success' && result && (
          <AnalysisResult result={result} inputText={inputText} onReset={handleReset} />
        )}

        {status === 'idle' && (
          <div style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            padding: '20px 24px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14 }}>
              💡 예시 텍스트로 바로 시험해보기
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EXAMPLE_TEXTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(ex.text)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-base)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--brand-primary)';
                    e.currentTarget.style.background = 'var(--brand-primary-light)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.background = 'var(--bg-base)';
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-primary)', marginBottom: 3 }}>
                    {ex.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {ex.text.slice(0, 80)}…
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

/* ── 메인 export: 로그인 여부에 따라 분기 ── */
const AnalyzePage = () => {
  const token = localStorage.getItem('accessToken');
  return token ? <AnalyzeContent /> : <LoginRequired />;
};

export default AnalyzePage;