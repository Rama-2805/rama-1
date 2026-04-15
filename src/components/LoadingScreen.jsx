import React, { useState, useEffect } from 'react';
import { Shield, Activity } from 'lucide-react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing systems...');

  useEffect(() => {
    const messages = [
      'Initializing systems...',
      'Loading 3D digital twin engine...',
      'Connecting sensor networks...',
      'Calibrating ML models...',
      'Loading CWRU bearing dataset...',
      'Establishing machine intelligence...',
      'Ready.'
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 18 + 5;
        const idx = Math.min(messages.length - 1, Math.floor((next / 100) * messages.length));
        setStatus(messages[idx]);
        return Math.min(100, next);
      });
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.content}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <Shield size={40} color="#06b6d4" />
          </div>
          <h1 style={styles.title}>Factory<span style={styles.titleAccent}>Shield</span> AI</h1>
        </div>
        <div style={styles.barTrack}>
          <div style={{ ...styles.barFill, width: `${progress}%` }} />
        </div>
        <div style={styles.statusRow}>
          <Activity size={14} color="#06b6d4" style={{ animation: 'spin 2s linear infinite' }} />
          <span style={styles.statusText}>{status}</span>
          <span style={styles.percent}>{Math.round(progress)}%</span>
        </div>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed', inset: 0, background: 'var(--bg-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, transition: 'background 0.3s ease',
  },
  glow: {
    position: 'absolute', top: '50%', left: '50%',
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, var(--cyan-glow) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    animation: 'pulseGlow 3s ease-in-out infinite',
  },
  content: {
    position: 'relative', zIndex: 1, textAlign: 'center', width: 400,
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 48,
  },
  logoIcon: {
    width: 60, height: 60, borderRadius: 14,
    background: 'var(--cyan-dim)', border: '1px solid var(--surface-border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: {
    fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em',
  },
  titleAccent: { color: 'var(--cyan)' },
  barTrack: {
    width: '100%', height: 3, background: 'var(--surface-border)',
    borderRadius: 2, overflow: 'hidden', marginBottom: 16,
  },
  barFill: {
    height: '100%', borderRadius: 2, transition: 'width 0.4s ease-out',
    background: 'linear-gradient(90deg, var(--cyan), #0891b2)',
    boxShadow: '0 0 12px var(--cyan-glow)',
  },
  statusRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  statusText: {
    fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace",
  },
  percent: {
    fontSize: '0.8rem', color: 'var(--cyan)', fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
  },
};

export default LoadingScreen;
