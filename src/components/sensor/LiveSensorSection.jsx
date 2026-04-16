import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Wifi, WifiOff, Activity, Zap, AlertTriangle, Info } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, ReferenceLine, BarChart, Bar } from 'recharts';
import useSensorStream from '../../hooks/useSensorStream';
import { calculateRMS, calculateKurtosis } from '../../utils/signalProcessing';
import { calculateAnomalyScore, classifyStatus } from '../../utils/anomalyDetection';
import { computeFrequencyBands } from '../../utils/fftApprox';

const LiveSensorSection = () => {
  const {
    latestData, isConnected, connectionType, sampleRate,
    buffer, magnitudeHistory, startSimulation, stopSimulation
  } = useSensorStream();

  const [waveformData, setWaveformData] = useState([]);
  const [rms, setRms] = useState(0);
  const [anomalyScore, setAnomalyScore] = useState(0);
  const [status, setStatus] = useState({ status: 'normal', label: 'Normal', color: '#10b981' });
  const [freqBands, setFreqBands] = useState([]);
  const [kurtosis, setKurtosis] = useState(3.0);
  const frameRef = useRef(0);

  useEffect(() => {
    frameRef.current++;
    if (frameRef.current % 2 !== 0) return; // update every 2nd frame

    if (buffer.length > 0) {
      const recent = buffer.slice(-200);
      setWaveformData(recent.map((d, i) => ({ i, v: d.mape || 0, magnitude: d.magnitude, x: d.x, y: d.y, z: d.z })));

      const magnitudes = recent.map(d => d.magnitude);
      const newRms = calculateRMS(magnitudes);
      const newKurt = calculateKurtosis(magnitudes);
      const newAnomaly = calculateAnomalyScore(magnitudes);
      const newStatus = classifyStatus(newAnomaly);
      const bands = computeFrequencyBands(magnitudes);

      setRms(newRms);
      setKurtosis(newKurt);
      setAnomalyScore(newAnomaly);
      setStatus(newStatus);
      setFreqBands(bands);
    }
  }, [latestData, buffer]);

  const qrUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/#sensor-page`;

  return (
    <section id="live-sensor" style={styles.section}>
      <div style={styles.container}>
        {/* Header */}
        <motion.div style={styles.header}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <div className="section-badge"><Smartphone size={14} /> Live Sensor Demo</div>
          <h2 className="section-title">Real-Time Vibration Stream</h2>
          <p style={styles.subtitle}>
            Connect your smartphone as a low-cost prototype vibration sensor. The phone accelerometer
            streams live motion data directly to this dashboard.
          </p>
          <div style={styles.disclaimer}>
            <Info size={14} color="var(--cyan)" />
            <span>
              <strong>Demo transparency:</strong> Live input from smartphone accelerometer — used as a low-cost prototype vibration stream.
              Model intelligence is benchmarked on industrial CWRU bearing datasets; smartphone data is for live interactive demonstration.
            </span>
          </div>
        </motion.div>

        <div style={styles.mainGrid}>
          {/* Left: Connection Panel */}
          <motion.div style={styles.connectionPanel}
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <div style={styles.connHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {isConnected
                  ? <Wifi size={18} color="var(--emerald)" />
                  : <WifiOff size={18} color="var(--text-muted)" />}
                <span style={styles.connTitle}>
                  {isConnected ? 'Sensor Connected' : 'No Sensor Active'}
                </span>
              </div>
              {isConnected && (
                <span style={{
                  ...styles.connBadge,
                  background: connectionType === 'simulated' ? 'rgba(139,92,246,0.15)' : 'var(--emerald-glow)',
                  color: connectionType === 'simulated' ? 'var(--purple)' : 'var(--emerald)',
                }}>
                  {connectionType === 'simulated' ? 'SIMULATED' : connectionType === 'broadcast' ? 'BROADCAST' : 'WEBSOCKET'}
                </span>
              )}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {connectionType !== 'simulated' ? (
                <button style={styles.btnStart} onClick={startSimulation}>
                  <Activity size={14} /> Start Simulation
                </button>
              ) : (
                <button style={styles.btnStop} onClick={stopSimulation}>
                  <WifiOff size={14} /> Stop Simulation
                </button>
              )}
              <button 
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '12px 20px',
                  background: (connectionType === 'websocket' || connectionType === 'broadcast') ? 'var(--emerald-dim)' : 'transparent',
                  color: (connectionType === 'websocket' || connectionType === 'broadcast') ? 'var(--emerald)' : 'var(--text-secondary)',
                  border: (connectionType === 'websocket' || connectionType === 'broadcast') ? '1px solid var(--emerald-glow)' : '1px solid var(--surface-border)',
                  borderRadius: 10, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', justifyContent: 'center',
                  fontFamily: "'Inter', sans-serif", transition: 'all 0.2s ease'
                }}
                onClick={() => { stopSimulation(); }}
              >
                <Smartphone size={14} /> 
                {(connectionType === 'websocket' || connectionType === 'broadcast') ? 'Receiving Mobile Data' : 'Listen for Mobile Sensor'}
              </button>
            </div>

            {/* Phone connect instructions */}
            <div style={styles.phoneInstructions}>
              <p style={styles.instrTitle}>📱 Connect Real Phone</p>
              <ol style={styles.instrList}>
                <li>Ensure laptop and phone are on <strong>same Wi-Fi</strong></li>
                <li>
                  Open a new tab on your phone exactly here:<br/>
                  <code style={{...styles.code, background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '0.8rem', padding: '4px', display: 'block', marginTop: 4 }}>
                    {qrUrl.includes('localhost') ? qrUrl.replace('localhost', '<LAPTOP-WIFI-IP>') : qrUrl}
                  </code>
                </li>
                <li>Tap "Start Sensing" &amp; grant motion access on phone.</li>
              </ol>
              <div style={styles.wsNote}>
                <span style={{color: 'var(--amber)', fontWeight: 'bold'}}>⚠️ CRITICAL REQUIREMENT:</span><br/>
                For the laptop to talk to the phone, you must open a new terminal tab right now and run:<br/>
                <code style={{...styles.code, padding: '2px 6px', marginTop: '4px', display: 'inline-block'}}>npm run server</code>
              </div>
            </div>

            {/* Live XYZ readout */}
            {isConnected && latestData && (
              <div style={styles.xyzGrid}>
                {['x', 'y', 'z'].map(axis => (
                  <div key={axis} style={styles.xyzCard}>
                    <span style={styles.xyzLabel}>{axis.toUpperCase()}</span>
                    <span style={styles.xyzValue}>{(latestData[axis] || 0).toFixed(3)}</span>
                    <span style={styles.xyzUnit}>m/s²</span>
                  </div>
                ))}
              </div>
            )}

            {/* Sample rate */}
            {isConnected && (
              <div style={styles.sampleRate}>
                <Activity size={12} color="var(--cyan)" />
                <span style={styles.sampleRateText}>{sampleRate} samples/sec</span>
              </div>
            )}
          </motion.div>

          {/* Right: Live charts */}
          <motion.div style={styles.chartsArea}
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Waveform */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>Live MAPE Error Stream</span>
                <span style={{ ...styles.statusBadge, background: `${status.color}20`, color: status.color }}>
                  ● {status.label}
                </span>
              </div>
              <div style={{ height: 140 }}>
                {waveformData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={waveformData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                      <YAxis domain={['auto', 'auto']} hide />
                      <XAxis dataKey="i" hide />
                      <ReferenceLine y={5.0} stroke="rgba(245,158,11,0.4)" strokeDasharray="4 2" />
                      <Line
                        type="monotone" dataKey="v" stroke="#f59e0b"
                        dot={false} strokeWidth={1.5} isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={styles.noDataMsg}>Start a simulation to see the nasa_test2_features continuous data stream</div>
                )}
              </div>
            </div>

            {/* Metrics row */}
            <div style={styles.metricsRow}>
              {[
                { label: 'RMS Vibration', value: rms.toFixed(3), unit: 'g' },
                { label: 'Kurtosis', value: kurtosis.toFixed(2), unit: '' },
                { label: 'Anomaly Score', value: (anomalyScore * 100).toFixed(1), unit: '%' },
                { label: 'MAPE (Error)', value: latestData && latestData.mape !== undefined ? latestData.mape.toFixed(2) : '—', unit: '%' },
              ].map(m => (
                <div key={m.label} style={styles.metricTile}>
                  <span style={styles.metricTileLabel}>{m.label}</span>
                  <span style={styles.metricTileValue}>{m.value}<span style={styles.metricTileUnit}>{m.unit}</span></span>
                </div>
              ))}
            </div>

            {/* Frequency bands */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>Frequency Band Power Estimate</span>
                <span style={styles.chartMeta}>Simplified spectral approximation</span>
              </div>
              <div style={{ height: 100 }}>
                {freqBands.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={freqBands} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                      <XAxis dataKey="band" hide />
                      <YAxis domain={[0, 1]} hide />
                      <Bar dataKey="normalizedPower" fill="var(--cyan)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={styles.noDataMsg}>Frequency bands will appear here</div>
                )}
              </div>
              <div style={styles.bandLabels}>
                <span>Low (0-8 Hz)</span><span>Mid (8-24 Hz)</span><span>High (24+ Hz)</span>
              </div>
            </div>

            {/* Anomaly score bar */}
            <div style={styles.anomalyBar}>
              <div style={styles.anomalyHeader}>
                <AlertTriangle size={14} color={status.color} />
                <span style={styles.anomalyLabel}>Rolling Anomaly Score</span>
                <span style={{ ...styles.anomalyValue, color: status.color }}>
                  {(anomalyScore * 100).toFixed(1)}%
                </span>
              </div>
              <div style={styles.anomalyTrack}>
                <motion.div
                  animate={{ width: `${anomalyScore * 100}%` }}
                  transition={{ duration: 0.3 }}
                  style={{
                    ...styles.anomalyFill,
                    background: anomalyScore < 0.25
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : anomalyScore < 0.55
                      ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                      : 'linear-gradient(90deg, #ef4444, #dc2626)',
                  }}
                />
                <div style={{ ...styles.anomalyThresh, left: '25%' }} />
                <div style={{ ...styles.anomalyThresh, left: '55%' }} />
              </div>
              <div style={styles.anomalyLegend}>
                <span style={{ color: 'var(--emerald)' }}>Normal</span>
                <span style={{ color: 'var(--amber)' }}>Warning</span>
                <span style={{ color: 'var(--red)' }}>Critical</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: { padding: '100px 0', background: 'var(--bg-secondary)', position: 'relative', transition: 'background 0.3s ease' },
  container: { maxWidth: 1280, margin: '0 auto', padding: '0 32px' },
  header: { textAlign: 'center', marginBottom: 48 },
  subtitle: { fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 20px', lineHeight: 1.7 },
  disclaimer: {
    display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: 700, margin: '0 auto',
    padding: '12px 18px', background: 'var(--cyan-dim)', border: '1px solid var(--surface-border)',
    borderRadius: 10, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, textAlign: 'left',
  },
  mainGrid: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' },
  connectionPanel: {
    background: 'var(--bg-card)', border: '1px solid var(--surface-border)',
    borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 20,
    backdropFilter: 'blur(12px)', transition: 'all 0.3s ease',
  },
  connHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  connTitle: { fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' },
  connBadge: {
    padding: '3px 10px', borderRadius: 6, fontSize: '0.65rem',
    fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
  },
  connActions: {},
  btnStart: {
    display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '12px 20px',
    background: 'linear-gradient(135deg, var(--cyan), #0891b2)', color: '#fff',
    border: 'none', borderRadius: 10, fontSize: '0.88rem', fontWeight: 600,
    cursor: 'pointer', justifyContent: 'center', fontFamily: "'Inter', sans-serif",
    transition: 'all 0.3s ease',
  },
  btnStop: {
    display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '12px 20px',
    background: 'var(--red-glow)', color: 'var(--red)',
    border: '1px solid var(--red)', borderRadius: 10,
    fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
    justifyContent: 'center', fontFamily: "'Inter', sans-serif",
    transition: 'all 0.3s ease',
  },
  phoneInstructions: {
    padding: '16px', background: 'var(--bg-glass)',
    border: '1px solid var(--surface-border)', borderRadius: 10,
  },
  instrTitle: { fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 },
  instrList: {
    fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: 16,
    display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10,
  },
  code: {
    background: 'var(--cyan-dim)', color: 'var(--cyan)', padding: '1px 5px',
    borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem',
  },
  wsNote: { fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 },
  xyzGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 },
  xyzCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    padding: '10px 6px', background: 'var(--bg-glass)',
    border: '1px solid var(--surface-border)', borderRadius: 8,
  },
  xyzLabel: { fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px' },
  xyzValue: {
    fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  xyzUnit: { fontSize: '0.6rem', color: 'var(--text-muted)' },
  sampleRate: { display: 'flex', alignItems: 'center', gap: 8 },
  sampleRateText: { fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" },
  chartsArea: { display: 'flex', flexDirection: 'column', gap: 16 },
  chartCard: {
    background: 'var(--bg-card)', border: '1px solid var(--surface-border)',
    borderRadius: 12, padding: '16px 20px', backdropFilter: 'blur(12px)', transition: 'all 0.3s ease',
  },
  chartHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  chartTitle: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' },
  chartMeta: { fontSize: '0.72rem', color: 'var(--text-muted)' },
  statusBadge: {
    padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
  },
  noDataMsg: {
    height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic',
  },
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 },
  metricTile: {
    display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px',
    background: 'var(--bg-card)', border: '1px solid var(--surface-border)',
    borderRadius: 10, textAlign: 'center', transition: 'all 0.3s ease',
  },
  metricTileLabel: { fontSize: '0.7rem', color: 'var(--text-muted)' },
  metricTileValue: {
    fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  metricTileUnit: { fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 3 },
  bandLabels: {
    display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem',
    color: 'var(--text-muted)', marginTop: 4,
  },
  anomalyBar: {
    background: 'var(--bg-card)', border: '1px solid var(--surface-border)',
    borderRadius: 12, padding: '16px 20px', transition: 'all 0.3s ease',
  },
  anomalyHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  anomalyLabel: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 },
  anomalyValue: { fontSize: '0.9rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" },
  anomalyTrack: {
    width: '100%', height: 8, background: 'var(--surface-border)',
    borderRadius: 4, overflow: 'visible', position: 'relative', marginBottom: 8,
  },
  anomalyFill: { height: '100%', borderRadius: 4, maxWidth: '100%' },
  anomalyThresh: {
    position: 'absolute', top: -2, bottom: -2, width: 1,
    background: 'rgba(255,255,255,0.1)',
  },
  anomalyLegend: {
    display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 600,
  },
};

export default LiveSensorSection;
