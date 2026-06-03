/**
 * App.jsx
 * 라우팅 및 전역 레이아웃
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage    from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import HistoryPage from './pages/HistoryPage';
import AboutPage   from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';

import { useAuth } from './hooks';

import './styles/global.css';

const App = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar user={user} onLogout={logout} />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/analyze"  element={<AnalyzePage />} />
            <Route path="/history"  element={<HistoryPage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/login"    element={<LoginPage onLogin={login} />} />
            <Route path="/register" element={<RegisterPage onLogin={login} />} />
            <Route path="*"         element={<NotFoundPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
