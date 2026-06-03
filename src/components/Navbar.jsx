/**
 * components/Navbar.jsx
 * 상단 네비게이션 바
 */

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/',        label: '홈' },
    { to: '/analyze', label: '뉴스 분석' },
    { to: '/history', label: '분석 기록' },
    { to: '/about',   label: '서비스 소개' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: scrolled ? '1px solid var(--border-default)' : '1px solid transparent',
      transition: 'all 200ms ease',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        height: 'var(--nav-height)',
        gap: 32,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="1.5"/>
              <path d="M6 9h6M9 6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="9" r="2" fill="white"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              NewsCheck
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', lineHeight: 1 }}>
              AI 뉴스 신뢰도 평가
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: 4, flex: 1 }} role="navigation">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--brand-primary-light)' : 'transparent',
                transition: 'all 150ms',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {user.name}님
              </span>
              <button
                onClick={onLogout}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--border-default)',
                  background: 'transparent',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--border-default)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                }}
              >
                로그인
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  background: 'var(--brand-primary)',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                시작하기
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
