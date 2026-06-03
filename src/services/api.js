/**
 * services/api.js
 * AI 뉴스 신뢰도 평가 플랫폼 — API 서비스 레이어
 * FastAPI (AI 서버) + Spring Boot (메인 서버) 연동
 */

import axios from 'axios';

/* ─── Base URLs ─── */
const AI_SERVER_URL   = process.env.REACT_APP_AI_SERVER_URL   || 'http://localhost:8000';
const MAIN_SERVER_URL = process.env.REACT_APP_MAIN_SERVER_URL || 'http://localhost:8080';

/* ─── Axios instances ─── */
const aiClient = axios.create({
  baseURL: AI_SERVER_URL,
  timeout: 35000,
  headers: { 'Content-Type': 'application/json' },
});

const mainClient = axios.create({
  baseURL: MAIN_SERVER_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/* ─── Token 자동 주입 interceptor ─── */
const authInterceptor = (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};
mainClient.interceptors.request.use(authInterceptor);

/* ─── Response 에러 핸들러 ─── */
const handleError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || data?.error || '서버 오류가 발생했습니다.';
    throw { status, message };
  } else if (error.request) {
    throw { status: 0, message: '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.' };
  } else {
    throw { status: -1, message: error.message };
  }
};

aiClient.interceptors.response.use(r => r, handleError);
mainClient.interceptors.response.use(r => r, handleError);


/* ═══════════════════════════════════════════
   Analysis API  (FastAPI — Python AI 서버)
   ═══════════════════════════════════════════ */

/**
 * 뉴스 텍스트 신뢰도 분석
 * @param {string} text - 뉴스 제목 또는 본문 (최대 2,000자)
 * @returns {Promise<AnalysisResult>}
 */
export const analyzeNews = async (text) => {
  const { data } = await aiClient.post('/api/analyze', { text });
  return data;
};

/**
 * 분석 결과 조회 (비동기 처리용)
 * @param {string} taskId - 분석 작업 ID
 */
export const getAnalysisResult = async (taskId) => {
  const { data } = await aiClient.get(`/api/analyze/result/${taskId}`);
  return data;
};

/**
 * 출처 검증 (NAVER News API 연동)
 * @param {string} query - 검색 쿼리
 */
export const verifySource = async (query) => {
  const { data } = await aiClient.post('/api/source/verify', { query });
  return data;
};

/**
 * 유사 기사 검색
 * @param {string} text
 */
export const searchSimilarArticles = async (text) => {
  const { data } = await aiClient.post('/api/articles/similar', { text });
  return data;
};


/* ═══════════════════════════════════════════
   Auth API  (Spring Boot — 메인 서버)
   ═══════════════════════════════════════════ */

export const authAPI = {
  /** 회원가입 */
  register: async (payload) => {
    const { data } = await mainClient.post('/api/auth/register', payload);
    return data;
  },

  /** 로그인 */
  login: async (email, password) => {
    const { data } = await mainClient.post('/api/auth/login', { email, password });
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    return data;
  },

  /** 로그아웃 */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  /** 내 정보 조회 */
  getMe: async () => {
    const { data } = await mainClient.get('/api/auth/me');
    return data;
  },
};


/* ═══════════════════════════════════════════
   History API  (Spring Boot)
   ═══════════════════════════════════════════ */

export const historyAPI = {
  /** 분석 기록 목록 조회 */
  getList: async ({ page = 0, size = 10 } = {}) => {
    const { data } = await mainClient.get('/api/history', { params: { page, size } });
    return data;
  },

  /** 분석 기록 상세 조회 */
  getDetail: async (id) => {
    const { data } = await mainClient.get(`/api/history/${id}`);
    return data;
  },

  /** 분석 기록 저장 */
  save: async (analysisResult) => {
    const { data } = await mainClient.post('/api/history', analysisResult);
    return data;
  },

  /** 분석 기록 삭제 */
  delete: async (id) => {
    await mainClient.delete(`/api/history/${id}`);
  },
};


/* ═══════════════════════════════════════════
   Statistics API  (Spring Boot)
   ═══════════════════════════════════════════ */

export const statsAPI = {
  /** 전체 분석 통계 */
  getOverall: async () => {
    const { data } = await mainClient.get('/api/stats/overall');
    return data;
  },

  /** 내 분석 통계 */
  getMyStats: async () => {
    const { data } = await mainClient.get('/api/stats/my');
    return data;
  },
};
