import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, Wifi, WifiOff, Activity, AlertTriangle } from 'lucide-react';
import useAccelerometer from '../hooks/useAccelerometer';
import { calculateRMS } from '../utils/signalProcessing';
import { classifyStatus } from '../utils/anomalyDetection';

const WS_URL_TRIES = [
  window.location.protocol === 'https:' ? `wss://${window.location.host}/ws-relay` : `ws://${window.location.host}/ws-relay`
];

const SensorPage = () => {
  const { data, isActive, permissionState, error, history, requestPermission, stop } = useAccelerometer();
  const [wsConnected, setWsConnected] = useState(false);
  const [broadcastActive, setBroadcastActive] = useState(false);
  const [rms, setRms] = useState(0);
  const [status, setStatus] = useState({ status: 'normal', label: 'Normal', color: '#10b981' });
  const wsRef = useRef(null);
  const channelRef = useRef(null);
  const historyRef = useRef([]);

  // Set up BroadcastChannel
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('aegis-sensor');
      setBroadcastActive(true);
    } catch (e) {
      setBroadcastActive(false);
    }
    return () => channelRef.current?.close();
  }, []);

  // Set up WebSocket
  useEffect(() => {
    const connect = (urlIdx = 0) => {
      if (urlIdx >= WS_URL_TRIES.length) return;
      try {
        const ws = new WebSocket(WS_URL_TRIES[urlIdx]);
        ws.onopen = () => { setWsConnected(true); wsRef.current = ws; };
        ws.onerror = () => { ws.close(); setTimeout(() => connect(urlIdx + 1), 1000); };
        ws.onclose = () => { setWsConnected(false); setTimeout(() => connect(0), 5000); };
      } catch (e) { connect(urlIdx + 1); }
    };
    connect();
    return () => wsRef.current?.close();
  }, []);

  // Send data on every reading
  useEffect(() => {
    if (!isActive || !data.timestamp) return;
    historyRef.current.push(data.magnitude);
    if (historyRef.current.length > 60) historyRef.current = historyRef.current.slice(-60);

    const newRms = calculateRMS(historyRef.current);
    setRms(newRms);

    const anomalyScore = Math.min(1, Math.max(0, (newRms - 9.5) / 4));
    setStatus(classifyStatus(anomalyScore));

    const payload = { ...data, rms: newRms, anomalyScore };

    // BroadcastChannel
    channelRef.current?.postMessage(payload);

    // WebSocket
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'sensor_data', payload }));
    }
  }, [data, isActive]);

  const statusColor = status.color;

  return (
    <div style={styles.page}>
      <div style={styles.bgGlow} />

      <div style={styles.header}>
        <Shield size={22} color="#06b6d4" />
        <span style={styles.headerTitle}>Aegis</span>
        <span style={styles.headerSub}>Mobile Sensor</span>
      </div>

      {/* Connection status */}
      <div style={styles.connRow}>
        <div style={{ ...styles.connBadge, background: wsConnected ? 'rgba(16,185,129,0.1)' : 'rgba(56,72,104,0.1)', borderColor: wsConnected ? 'rgba(16,185,129,0.3)' : 'rgba(56,72,104,0.3)' }}>
          <Wifi size={12} color={wsConnected ? '#10b981' : '#64748b'} />
          <span style={{ color: wsConnected ? '#10b981' : '#64748b', fontSize: '0.72rem' }}>
            WebSocket {wsConnected ? 'Connected' : 'Offline'}
          </span>
        </div>
        <div style={{ ...styles.connBadge, background: broadcastActive ? 'rgba(6,182,212,0.1)' : 'rgba(56,72,104,0.1)', borderColor: broadcastActive ? 'rgba(6,182,212,0.3)' : 'rgba(56,72,104,0.3)' }}>
          <Activity size={12} color={broadcastActive ? '#06b6d4' : '#64748b'} />
          <span style={{ color: broadcastActive ? '#06b6d4' : '#64748b', fontSize: '0.72rem' }}>
            Broadcast {broadcastActive ? 'Ready' : 'N/A'}
          </span>
        </div>
      </div>

      {/* Status circle */}
      <div style={styles.statusSection}>
        <div style={{ ...styles.statusCircle, boxShadow: isActive ? `0 0 60px ${statusColor}30` : '0 0 20px rgba(56,72,104,0.2)', borderColor: isActive ? `${statusColor}40` : 'rgba(56,72,104,0.3)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: isActive ? statusColor : '#334155', fontFamily: "'JetBrains Mono', monospace" }}>
            {isActive ? rms.toFixed(2) : '—'}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>RMS (m/s²)</div>
          {isActive && (
            <div style={{ ...styles.statusLabel, color: statusColor }}>● {status.label}</div>
          )}
        </div>
      </div>

      {/* XYZ values */}
      {isActive && (
        <div style={styles.xyzGrid}>
          {['x', 'y', 'z'].map(axis => (
            <div key={axis} style={styles.xyzCard}>
              <span style={styles.xyzAxis}>{axis.toUpperCase()}</span>
              <span style={styles.xyzVal}>{(data[axis] || 0).toFixed(2)}</span>
              <span style={styles.xyzUnit}>m/s²</span>
            </div>
          ))}
        </div>
      )}

      {/* Magnitude */}
      {isActive && (
        <div style={styles.magnitudeRow}>
          <span style={styles.magLabel}>Magnitude</span>
          <span style={styles.magValue}>{data.magnitude.toFixed(3)} m/s²</span>
        </div>
      )}

      {/* Control button */}
      <div style={styles.btnWrap}>
        {!isActive ? (
          <button style={styles.btnStart} onClick={requestPermission}>
            <Activity size={20} />
            {permissionState === 'denied' ? 'Permission Denied' : 'Start Sensing'}
          </button>
        ) : (
          <button style={styles.btnStop} onClick={stop}>
            <WifiOff size={20} />
            Stop Sensing
          </button>
        )}
      </div>

      {error && (
        <div style={styles.errorMsg}>
          <AlertTriangle size={14} color="#f59e0b" />
          <span>{error}</span>
        </div>
      )}

      {/* Instructions */}
      <div style={styles.instructions}>
        <p style={styles.instrTitle}>Instructions</p>
        <p style={styles.instrText}>
          Tap "Start Sensing" and grant motion permission when prompted.
          Place your phone on a vibrating surface or shake it to simulate vibration.
          The data streams live to the Aegis dashboard.
        </p>
        <p style={styles.disclaimer}>
          ⚠️ Smartphone accelerometer is used as a low-cost prototype sensor for demo purposes.
          Industrial deployment uses calibrated vibration transducers.
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', background: '#0a0e17', display: 'flex',
    flexDirection: 'column', alignItems: 'center', padding: '24px 20px',
    position: 'relative', overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
    width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, zIndex: 1,
  },
  headerTitle: { fontSize: '1.2rem', fontWeight: 800, color: '#e2e8f0' },
  headerSub: { fontSize: '0.7rem', color: '#64748b', padding: '3px 8px', background: 'rgba(56,72,104,0.2)', borderRadius: 6 },
  connRow: { display: 'flex', gap: 10, marginBottom: 32, zIndex: 1 },
  connBadge: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
    borderRadius: 100, border: '1px solid',
  },
  statusSection: { marginBottom: 32, zIndex: 1 },
  statusCircle: {
    width: 200, height: 200, borderRadius: '50%',
    background: 'rgba(15,20,35,0.8)', border: '2px solid',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 6, transition: 'all 0.3s ease',
  },
  statusLabel: { fontSize: '0.8rem', fontWeight: 700 },
  xyzGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%', maxWidth: 360, marginBottom: 16, zIndex: 1 },
  xyzCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    padding: '14px 10px', background: 'rgba(15,20,35,0.6)',
    border: '1px solid rgba(56,72,104,0.2)', borderRadius: 12,
  },
  xyzAxis: { fontSize: '0.65rem', fontWeight: 700, color: '#64748b', letterSpacing: '1px' },
  xyzVal: { fontSize: '1.1rem', fontWeight: 700, color: '#06b6d4', fontFamily: "'JetBrains Mono', monospace" },
  xyzUnit: { fontSize: '0.6rem', color: '#64748b' },
  magnitudeRow: {
    display: 'flex', gap: 10, alignItems: 'center', marginBottom: 32, zIndex: 1,
  },
  magLabel: { fontSize: '0.8rem', color: '#64748b' },
  magValue: { fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', fontFamily: "'JetBrains Mono', monospace" },
  btnWrap: { marginBottom: 20, zIndex: 1 },
  btnStart: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '16px 40px',
    background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff',
    border: 'none', borderRadius: 14, fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
    boxShadow: '0 4px 24px rgba(6,182,212,0.35)',
  },
  btnStop: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '16px 40px',
    background: 'rgba(239,68,68,0.1)', color: '#ef4444',
    border: '2px solid rgba(239,68,68,0.3)', borderRadius: 14,
    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  errorMsg: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 16px', background: 'rgba(245,158,11,0.1)',
    border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10,
    fontSize: '0.8rem', color: '#f59e0b', marginBottom: 16, zIndex: 1,
  },
  instructions: {
    maxWidth: 360, zIndex: 1, padding: '20px',
    background: 'rgba(15,20,35,0.5)', border: '1px solid rgba(56,72,104,0.15)',
    borderRadius: 16, marginTop: 8,
  },
  instrTitle: { fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 8 },
  instrText: { fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.65, marginBottom: 12 },
  disclaimer: { fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5, fontStyle: 'italic' },
};

export default SensorPage;
