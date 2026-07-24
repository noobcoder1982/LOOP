"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../../components/Dashboard';
import { useAuth } from '../../lib/AuthContext.jsx';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        fontFamily: 'var(--db-font-mono, monospace)',
        fontSize: '0.8rem',
        letterSpacing: '0.05em'
      }}>
        [ VERIFYING TELEMETRY CONSOLE SESSION... ]
      </div>
    );
  }

  return (
    <Dashboard 
      setView={(view) => router.push(view === 'landing' ? '/' : `/${view}`)} 
      signOut={signOut} 
    />
  );
}
