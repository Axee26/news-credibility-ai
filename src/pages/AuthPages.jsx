/**
 * pages/LoginPage.jsx
 * 로그인 페이지
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export const LoginPage = ({ onLogin }) => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    setLoading(true); setError('');
    try {
      const data = await authAPI.login(form.email, form.password);
      onLogin(data.user || data);
      navigate('/analyze');
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
    background: 'var(--bg-base)', fontSize: 14,
    color: 'var(--text-primary)', outline: 'none',
    transition: 'border-color var(--transition)',
    fontFamily: 'var(--font-sans)',
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-default)',
          padding: '40px',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'var(--brand-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
                <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>로그인</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
              NewsCheck 계정으로 로그인하세요
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                이메일
              </label>
              <input
                type="email" name="email"
                value={form.email} onChange={handleChange}
                placeholder="example@email.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                비밀번호
              </label>
              <input
                type="password" name="password"
                value={form.password} onChange={handleChange}
                placeholder="비밀번호 입력"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                background: 'var(--trust-low-bg)', color: 'var(--trust-low)',
                fontSize: 13, marginBottom: 16,
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                borderRadius: 'var(--radius-md)', border: 'none',
                background: loading ? 'var(--bg-sunken)' : 'var(--brand-primary)',
                color: loading ? 'var(--text-tertiary)' : 'white',
                fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition)',
              }}
            >
              {loading ? '로그인 중…' : '로그인'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
            계정이 없으신가요?{' '}
            <Link to="/register" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};


/**
 * pages/RegisterPage.jsx
 * 회원가입 페이지
 */
export const RegisterPage = ({ onLogin }) => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('모든 항목을 입력해주세요.'); return; }
    if (form.password !== form.confirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (form.password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    setLoading(true); setError('');
    try {
      const data = await authAPI.register({ name: form.name, email: form.email, password: form.password });
      onLogin(data.user || data);
      navigate('/analyze');
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name',     label: '이름',         type: 'text',     placeholder: '홍길동' },
    { name: 'email',    label: '이메일',        type: 'email',    placeholder: 'example@email.com' },
    { name: 'password', label: '비밀번호',      type: 'password', placeholder: '8자 이상' },
    { name: 'confirm',  label: '비밀번호 확인', type: 'password', placeholder: '비밀번호 재입력' },
  ];

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
    background: 'var(--bg-base)', fontSize: 14,
    color: 'var(--text-primary)', outline: 'none',
    transition: 'border-color var(--transition)',
    fontFamily: 'var(--font-sans)',
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-default)',
          padding: '40px',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>회원가입</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
              NewsCheck 계정을 만들어 분석 기록을 저장하세요
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {fields.map(f => (
              <div key={f.name} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  {f.label}
                </label>
                <input
                  type={f.type} name={f.name}
                  value={form[f.name]} onChange={handleChange}
                  placeholder={f.placeholder}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                />
              </div>
            ))}

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                background: 'var(--trust-low-bg)', color: 'var(--trust-low)',
                fontSize: 13, marginBottom: 16,
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                borderRadius: 'var(--radius-md)', border: 'none',
                background: loading ? 'var(--bg-sunken)' : 'var(--brand-primary)',
                color: loading ? 'var(--text-tertiary)' : 'white',
                fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4,
              }}
            >
              {loading ? '처리 중…' : '회원가입'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
              로그인
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
