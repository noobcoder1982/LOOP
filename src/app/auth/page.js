"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext.jsx';
import '../../App.css';

export default function AuthPage() {
  const containerRef = useRef(null);
  const router = useRouter();
  const { user, loading: authLoading, signIn, signUp } = useAuth();

  const [authMode, setAuthMode] = useState('login');
  const [authFullName, setAuthFullName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoaderActive, setAuthLoaderActive] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoaderActive(true);

    try {
      if (authMode === 'login') {
        const { error } = await signIn({ email: authEmail, password: authPassword });
        if (error) {
          setAuthError(error.message || 'Login failed. Please check your credentials.');
        } else {
          router.push('/dashboard');
        }
      } else {
        const { error } = await signUp({ email: authEmail, password: authPassword, fullName: authFullName });
        if (error) {
          setAuthError(error.message || 'Sign up failed. Please try again.');
        } else {
          setShowVerifyPopup(true);
        }
      }
    } catch (err) {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setAuthLoaderActive(false);
    }
  };

  return (
    <div ref={containerRef} className="auth-split-wrapper">
      {/* Email Verification Popup Overlay */}
      {showVerifyPopup && (
        <div className="auth-verify-overlay">
          <div className="auth-verify-modal">
            <div className="auth-verify-icon">✉️</div>
            <h2 className="auth-verify-title">Check your email</h2>
            <p className="auth-verify-desc">
              We&apos;ve sent a verification link to <strong>{authEmail}</strong>.<br />
              Please verify your email before logging in.
            </p>
            <button
              className="auth-action-submit"
              onClick={() => {
                setShowVerifyPopup(false);
                setAuthMode('login');
                setAuthPassword('');
              }}
            >
              BACK TO LOGIN ↗
            </button>
          </div>
        </div>
      )}

      {/* Left Hero Showcase Panel */}
      <div className="auth-left-hero">
        <div className="auth-hero-glow-top" />
        <div className="auth-hero-glow-bottom" />

        {/* Header */}
        <div className="auth-hero-header">
          <Link href="/" className="auth-hero-brand">
            loop<span>.</span>
          </Link>
          <div className="auth-hero-badge">
            [ CONSOLE v2.6 ]
          </div>
        </div>

        {/* Hero Content */}
        <div className="auth-hero-body">
          <div className="auth-hero-tagline">
            <span className="auth-hero-tagline-dot" />
            Realtime Feedback Telemetry
          </div>

          <h1 className="auth-hero-title">
            the continuous <em>intelligence</em> system for product teams.
          </h1>

          {/* Live Telemetry Ticker Box */}
          <div className="auth-hero-telemetry-box">
            <div className="auth-telemetry-item">
              <span className="auth-telemetry-label">ingestion speed</span>
              <span className="auth-telemetry-val accent">3.4M/s</span>
            </div>
            <div className="auth-telemetry-item">
              <span className="auth-telemetry-label">uptime sla</span>
              <span className="auth-telemetry-val">99.99%</span>
            </div>
            <div className="auth-telemetry-item">
              <span className="auth-telemetry-label">drift alerts</span>
              <span className="auth-telemetry-val">0 active</span>
            </div>
          </div>

          {/* Testimonial */}
          <div className="auth-hero-testimonial">
            <p className="auth-testimonial-quote">
              &quot;LOOP completely streamlined how our engineering team triages user feedback into actionable code commits.&quot;
            </p>
            <div className="auth-testimonial-author">
              — Sarah Lin, Lead Systems Architect at Vercel
            </div>
          </div>
        </div>

        {/* Hero Footer */}
        <div className="auth-hero-footer">
          &copy; {new Date().getFullYear()} LOOP INTELLIGENCE SYSTEMS INC. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* Right Auth Portal Side */}
      <div className="auth-right-portal">
        <nav className="auth-portal-nav">
          <Link href="/" className="auth-portal-back">
            ← return to site
          </Link>
        </nav>

        <div className="auth-form-card">
          {/* Header */}
          <div className="auth-card-header">
            <div className="auth-card-logo-row">
              <div className="auth-card-brand">
                loop<span>.</span>
              </div>
              <div className="auth-status-indicator">
                <span className="auth-status-dot" />
                LIVE CONSOLE
              </div>
            </div>

            <h2 className="auth-card-title">
              {authMode === 'login' ? 'welcome back' : 'create instance'}
            </h2>
            <p className="auth-card-subtitle">
              {authMode === 'login' 
                ? 'enter your credentials to access the intelligence console' 
                : 'sign up to start using the LOOP intelligence console'}
            </p>
          </div>

          {/* Mode Selector Switcher */}
          <div className="auth-tabs-row">
            <button 
              type="button"
              className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
            >
              login
            </button>
            <button 
              type="button"
              className={`auth-tab-btn ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => { setAuthMode('signup'); setAuthError(''); }}
            >
              sign up
            </button>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="auth-error-banner">
              {authError}
            </div>
          )}

          {/* Auth Form */}
          <form className="auth-input-form" onSubmit={handleAuthSubmit}>
            {authMode === 'signup' && (
              <div className="auth-field">
                <label className="auth-field-label">Full Name</label>
                <div className="auth-field-input-wrap">
                  <input 
                    type="text" 
                    placeholder="Alex Mercer" 
                    className="auth-field-input" 
                    required 
                    value={authFullName}
                    onChange={e => setAuthFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-field-label">Work Email</label>
              <div className="auth-field-input-wrap">
                <input 
                  type="email" 
                  placeholder="alex@company.com" 
                  className="auth-field-input" 
                  required 
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-field-label">Password</label>
              <div className="auth-field-input-wrap">
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  className="auth-field-input" 
                  required 
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  minLength={6}
                />
              </div>
            </div>

            {authMode === 'login' && (
              <div className="auth-form-options">
                <label className="auth-checkbox-label">
                  <input type="checkbox" defaultChecked style={{ accentColor: '#ff3c3c' }} />
                  <span>Remember instance</span>
                </label>
                <a href="#forgot" className="auth-forgot-link" onClick={(e) => e.preventDefault()}>
                  forgot password?
                </a>
              </div>
            )}

            <button type="submit" className="auth-action-submit" disabled={authLoaderActive}>
              {authLoaderActive
                ? 'Processing...'
                : authMode === 'login'
                  ? 'LOGIN TO CONSOLE ↗'
                  : 'CREATE INSTANCE ↗'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
