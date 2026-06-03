# NewsCheck — AI 기반 뉴스 신뢰도 평가 플랫폼

> 종합설계 MIDAS · 팀폴6 · 영남대학교 · v1.0

---

## 🗂️ 프로젝트 구조

```
news-credibility-platform/
├── public/
│   └── index.html              # HTML 진입점
├── src/
│   ├── index.js                # React 진입점
│   ├── App.jsx                 # 라우팅 & 전역 레이아웃
│   │
│   ├── styles/
│   │   └── global.css          # 전역 CSS 변수 & 리셋
│   │
│   ├── services/
│   │   └── api.js              # API 레이어 (FastAPI + Spring Boot)
│   │
│   ├── hooks/
│   │   └── index.js            # useAnalysis, useAuth, useHistory
│   │
│   ├── utils/
│   │   └── index.js            # 공통 유틸 (점수 분류, 포맷 등)
│   │
│   ├── components/
│   │   ├── Navbar.jsx          # 상단 네비게이션
│   │   ├── Footer.jsx          # 하단 푸터
│   │   ├── ScoreGauge.jsx      # 원형 신뢰도 점수 게이지
│   │   ├── MetricBar.jsx       # 세부 지표 프로그레스 바
│   │   ├── ArticleCard.jsx     # 유사 기사 카드
│   │   ├── AnalysisResult.jsx  # 분석 결과 전체 표시
│   │   └── LoadingSpinner.jsx  # AI 분석 로딩 UI
│   │
│   └── pages/
│       ├── HomePage.jsx        # 메인 랜딩
│       ├── AnalyzePage.jsx     # 뉴스 분석 (핵심)
│       ├── HistoryPage.jsx     # 분석 기록 목록
│       ├── AboutPage.jsx       # 서비스 소개
│       ├── AuthPages.jsx       # 로그인 / 회원가입
│       └── NotFoundPage.jsx    # 404
│
├── .env.example                # 환경 변수 예시
├── package.json
└── README.md
```

---

## 🚀 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일에서 서버 URL 설정

# 3. 개발 서버 시작
npm start
```

---

## 🔌 API 연동

### 백엔드 서버 두 개와 연동

| 서버         | URL 기본값                 | 역할                              |
|-------------|--------------------------|----------------------------------|
| FastAPI      | `http://localhost:8000`  | AI 모델 분석 (Python/KoELECTRA)   |
| Spring Boot  | `http://localhost:8080`  | 사용자 관리, 기록 저장, 통계        |

### FastAPI 엔드포인트 (AI 서버)

| Method | Path                          | 설명             |
|--------|-------------------------------|-----------------|
| POST   | `/api/analyze`                | 뉴스 텍스트 분석  |
| GET    | `/api/analyze/result/{taskId}`| 분석 결과 조회   |
| POST   | `/api/source/verify`          | 출처 검증        |
| POST   | `/api/articles/similar`       | 유사 기사 검색   |

### FastAPI 응답 형식 (`POST /api/analyze`)

```json
{
  "totalScore": 72,
  "metrics": {
    "sourceCredibility": 80,
    "exaggeration": 25,
    "aiSuspicion": 18
  },
  "similarArticles": [
    {
      "id": 1,
      "title": "기사 제목",
      "source": "연합뉴스",
      "url": "https://...",
      "publishedAt": "2026-05-15T10:00:00Z",
      "similarity": 87
    }
  ],
  "reasoning": [
    "공신력 있는 언론사에서 보도가 확인됩니다.",
    "텍스트 언어 표현이 비교적 중립적입니다.",
    "AI 생성 텍스트 패턴이 크게 감지되지 않습니다."
  ],
  "analyzedAt": "2026-05-15T12:34:56Z"
}
```

### Spring Boot 엔드포인트 (메인 서버)

| Method | Path                | 설명             |
|--------|---------------------|-----------------|
| POST   | `/api/auth/register`| 회원가입          |
| POST   | `/api/auth/login`   | 로그인 (JWT 발급) |
| GET    | `/api/auth/me`      | 내 정보 조회      |
| GET    | `/api/history`      | 분석 기록 목록    |
| POST   | `/api/history`      | 분석 기록 저장    |
| DELETE | `/api/history/{id}` | 분석 기록 삭제    |
| GET    | `/api/stats/overall`| 전체 통계        |

---

## 📊 점수 체계 (DRD §2.5.2 기준)

| 점수 범위 | 등급 | 의미                    |
|---------|-----|------------------------|
| 70 ~ 100 | 신뢰 | 공신력 있는 출처, 중립적 표현 |
| 40 ~ 69  | 주의 | 일부 지표 주의 필요       |
| 0 ~ 39   | 불신 | 가짜뉴스 가능성 높음      |

**종합 점수 산출 공식 (참고)**
```
totalScore = sourceCredibility × 0.4
           + (100 - exaggeration) × 0.35
           + (100 - aiSuspicion) × 0.25
```

---

## ⚠️ 유의 사항

- 본 서비스 결과는 AI 참고 정보이며 100% 정확도를 보장하지 않습니다.
- 최종 판단 책임은 사용자에게 있습니다.
- REACT_APP_DEMO_MODE=true 설정 시 Mock 데이터로 동작합니다.
