/**
 * hooks/index.js
 */

import { useState, useCallback, useEffect } from 'react';
import { historyAPI } from '../services/api';

/* ═══════════════════════════════
   useAnalysis
   ═══════════════════════════════ */
export const useAnalysis = () => {
  const [status, setStatus]     = useState('idle');
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);
  const [progress, setProgress] = useState(0);

  const analyze = useCallback(async (text) => {
    if (!text || text.trim().length < 10) {
      setError('최소 10자 이상의 뉴스 텍스트를 입력해주세요.');
      return;
    }
    if (text.length > 2000) {
      setError('최대 2,000자까지 입력 가능합니다.');
      return;
    }

    setStatus('loading');
    setError(null);
    setProgress(0);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) { clearInterval(timer); return prev; }
        return prev + Math.random() * 12;
      });
    }, 400);

    try {
      const { analyzeNews } = await import('../services/api');
      const data = await analyzeNews(text);
      clearInterval(timer);
      setProgress(100);
      setResult(data);
      setStatus('success');

      const token = localStorage.getItem('accessToken');
      if (token) {
        historyAPI.save({ inputText: text, ...data }).catch(() => {});
      }
      return data;
    } catch (err) {
      clearInterval(timer);
      setError(err.message || '분석 중 오류가 발생했습니다.');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  return { status, result, error, progress, analyze, reset };
};

/* ═══════════════════════════════
   useAuth
   ═══════════════════════════════ */
export const useAuth = () => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(user && localStorage.getItem('accessToken'));

  return { user, isAuthenticated, login, logout };
};

/* ═══════════════════════════════
   useHistory
   ═══════════════════════════════ */
export const useHistory = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage]       = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 0 : page;
      const data = await historyAPI.getList({ page: currentPage, size: 10 });
      const newItems = data.content || [];
      setItems(prev => reset ? newItems : [...prev, ...newItems]);
      setHasMore(!data.last);
      if (!reset) setPage(p => p + 1);
    } catch {
      // 에러 무시
    } finally {
      setLoading(false);
    }
  }, [page]);

  const deleteItem = useCallback(async (id) => {
    await historyAPI.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) loadMore(true);
  }, []);

  return { items, loading, hasMore, loadMore, deleteItem };
};
