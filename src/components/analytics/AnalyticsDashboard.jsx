import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip, RadialBarChart, RadialBar, ScatterChart, Scatter
} from 'recharts';
import { BarChart2, ChevronDown, Clock, Wrench, Zap } from 'lucide-react';
import { MACHINES, generateTimeSeriesData, generateAnomalyEvents } from '../../data/machineData';
import { estimateRUL } from '../../utils/anomalyDetection';

const HealthGauge = ({ score }) => {
  const color = score > 75 ? '#10b981' : score > 45 ? '#f59e0b' : '#ef4444';
  const angle = (score / 100) * 180 - 90;

  return (
    <div style={{ position: 'relative', width: 160, height: 90, margin: '0 auto' }}>
      {/* Arc background */}
      <svg width="160" height="90" viewBox="0 0 160 90">
        <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke="rgba(56,72,104,0.3)" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 10 80 A 70 70 0 0 1 150 80"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 220} 220`}
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 0.8s ease, stroke 0.4s' }}
        />
        {/* Needle */}
        <g transform={`translate(80 80) rotate(${angle})`}>
          <line x1="0" y1="0" x2="0" y2="-55" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="0" cy="0" r="5" fill={color} />
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center' }}>
        <span style={{ fontSize: '1.8rem', fontWeight: 900, color, fontFamily: "'JetBrains Mono', monospace" }}>{score}</span>
        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>%</span>
        <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 2 }}>Health Score</div>
      </div>
    </div>
  );
};

const AnalyticsDashboard = ({ machine, onMachineChange }) => {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [anomalyEvents, setAnomalyEvents] = useState([]);
  const [rul, setRul] = useState({ hours: 336, label: '~14 days', confidence: 0.78 });

  useEffect(() => {
    const data = generateTimeSeriesData(machine, 48);
    const events = generateAnomalyEvents(machine);
    setTimeSeriesData(data);
    setAnomalyEvents(events);
    const anomalyScore = machine.status === 'critical' ? 0.72 : machine.status === 'warning' ? 0.38 : 0.08;
    setRul(estimateRUL(anomalyScore));
  }, [machine]);

  const faultProbs = [
    { name: 'Normal', value: machine.status === 'healthy' ? 89 : machine.status === 'warning' ? 35 : 8, fill: '#10b981' },
    { name: 'Inner Race', value: machine.status === 'critical' ? 72 : machine.status === 'warning' ? 28 : 5, fill: '#ef4444' },
    { name: 'Outer Race', value: machine.status === 'warning' ? 55 : machine.status === 'critical' ? 48 : 4, fill: '#f59e0b' },
    { name: 'Ball Fault', value: machine.status === 'critical' ? 41 : machine.status === 'warning' ? 22 : 3, fill: '#f97316' },
  ];

  return (
    <section id="analytics" style={styles.section}>
      <div style={styles.container}>
        <motion.div style={styles.header}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-badge"><BarChart2 size={14} /> Machine Analytics</div>
          <h2 className="section-title">Asset Health Dashboard</h2>
          <p className="section-subtitle">Select any machine asset to view detailed health analytics, trend analysis, and predictive insights.</p>
        </motion.div>

        {/* Machine selector */}
        <div style={styles.machineSelector}>
          {MACHINES.map(m => (
            <button
              key={m.id}
              style={{
                ...styles.machineBtn,
                background: machine.id === m.id ? 'rgba(6,182,212,0.12)' : 'rgba(20,26,42,0.4)',
                border: `1px solid ${machine.id === m.id ? 'rgba(6,182,212,0.3)' : 'rgba(56,72,104,0.2)'}`,
                color: machine.id === m.id ? '#06b6d4' : '#94a3b8',
              }}
              onClick={() => onMachineChange(m)}
            >
              <span style={{
                width: 8, height: 8, borderRadius: '50%', display: 'inline-block',
                background: m.status === 'healthy' ? '#10b981' : m.status === 'warning' ? '#f59e0b' : '#ef4444',
              }} />
              {m.name}
            </button>
          ))}
        </div>

        {/* Top row: gauge + key metrics */}
        <div style={styles.topRow}>
          <motion.div style={styles.gaugeCard}
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <HealthGauge score={machine.healthScore} />
            <div style={styles.gaugeStats}>
              <div style={styles.gaugeStat}>
                <span style={styles.gsLabel}>Vibration</span>
                <span style={{ ...styles.gsValue, color: machine.vibration > 2 ? '#ef4444' : machine.vibration > 1 ? '#f59e0b' : '#10b981' }}>
                  {machine.vibration} g
                </span>
              </div>
              <div style={styles.gaugeStat}>
                <span style={styles.gsLabel}>Temperature</span>
                <span style={{ ...styles.gsValue, color: machine.temperature > 80 ? '#ef4444' : machine.temperature > 65 ? '#f59e0b' : '#e2e8f0' }}>
                  {machine.temperature}°C
                </span>
              </div>
              <div style={styles.gaugeStat}>
                <span style={styles.gsLabel}>Current</span>
                <span style={styles.gsValue}>{machine.current} A</span>
              </div>
              <div style={styles.gaugeStat}>
                <span style={styles.gsLabel}>Load</span>
                <span style={styles.gsValue}>{machine.load}%</span>
              </div>
            </div>
          </motion.div>

          {/* RUL card */}
          <motion.div style={styles.rulCard}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
          >
            <div style={styles.rulHeader}>
              <Clock size={16} color="#06b6d4" />
              <span style={styles.rulTitle}>Remaining Safe Operation</span>
            </div>
            <div style={styles.rulValue}>{rul.label}</div>
            <div style={styles.rulConfidence}>
              Prediction confidence: {(rul.confidence * 100).toFixed(0)}%
            </div>
            <div style={styles.rulBarTrack}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(rul.hours / 720) * 100}%` }}
                transition={{ duration: 0.8 }}
                style={{
                  ...styles.rulBarFill,
                  background: rul.hours < 24 ? '#ef4444' : rul.hours < 168 ? '#f59e0b' : '#10b981',
                }}
              />
            </div>
            <div style={styles.rulTicks}>
              <span>Now</span><span>7d</span><span>14d</span><span>30d</span>
            </div>
          </motion.div>

          {/* Fault probability */}
          <motion.div style={styles.faultCard}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
          >
            <h4 style={styles.cardTitle}>Fault Class Probability</h4>
            {faultProbs.map(fp => (
              <div key={fp.name} style={styles.fpRow}>
                <span style={styles.fpName}>{fp.name}</span>
                <div style={styles.fpBarTrack}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fp.value}%` }}
                    transition={{ duration: 0.8 }}
                    style={{ ...styles.fpBarFill, background: fp.fill }}
                  />
                </div>
                <span style={{ ...styles.fpValue, color: fp.fill }}>{fp.value}%</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Charts row */}
        <div style={styles.chartsGrid}>
          {/* Vibration trend */}
          <motion.div style={styles.chartCard}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 style={styles.cardTitle}>Vibration Trend (48h)</h4>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,72,104,0.15)" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} interval={7} />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} width={28} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [v.toFixed(3), 'Vibration (g)']} />
                  <Line type="monotone" dataKey="vibration" stroke="#06b6d4" dot={false} strokeWidth={2} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Temperature trend */}
          <motion.div style={styles.chartCard}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
          >
            <h4 style={styles.cardTitle}>Temperature Trend (48h)</h4>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,72,104,0.15)" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} interval={7} />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} width={28} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [v.toFixed(1), 'Temp (°C)']} />
                  <Line type="monotone" dataKey="temperature" stroke="#f59e0b" dot={false} strokeWidth={2} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Power trend */}
          <motion.div style={styles.chartCard}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
          >
            <h4 style={styles.cardTitle}>Power Consumption (48h)</h4>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSeriesData.filter((_, i) => i % 3 === 0)} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,72,104,0.15)" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} interval={3} />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} width={28} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [v.toFixed(1), 'kW']} />
                  <Bar dataKey="power" fill="#8b5cf6" radius={[2, 2, 0, 0]} isAnimationActive={false} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Anomaly events timeline */}
        <motion.div style={styles.timelineCard}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h4 style={styles.cardTitle}>Anomaly Event Timeline (Last 7 days)</h4>
          <div style={styles.timelineEvents}>
            {anomalyEvents.slice(0, 8).map((ev, i) => (
              <div key={ev.id} style={styles.timelineItem}>
                <div style={{
                  ...styles.timelineDot,
                  background: ev.severity === 'critical' ? '#ef4444' : ev.severity === 'warning' ? '#f59e0b' : '#3b82f6',
                  boxShadow: ev.severity === 'critical' ? '0 0 8px rgba(239,68,68,0.4)' : 'none',
                }} />
                <div style={styles.timelineContent}>
                  <span style={styles.tlType}>{ev.type.replace(/_/g, ' ')}</span>
                  <span style={styles.tlComp}>{ev.component}</span>
                </div>
                <span style={styles.tlScore}>{(ev.score * 100).toFixed(0)}%</span>
                <span style={styles.tlTime}>{ev.hoursAgo}h ago</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const tooltipStyle = {
  background: '#0f1420', border: '1px solid rgba(56,72,104,0.3)',
  borderRadius: 8, fontSize: '0.75rem',
};

const styles = {
  section: { padding: '100px 0', background: '#0a0e17' },
  container: { maxWidth: 1280, margin: '0 auto', padding: '0 32px' },
  header: { textAlign: 'center', marginBottom: 40 },
  machineSelector: { display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' },
  machineBtn: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px',
    borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
  },
  topRow: { display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 20, marginBottom: 20 },
  gaugeCard: {
    background: 'rgba(15,20,35,0.7)', border: '1px solid rgba(56,72,104,0.2)',
    borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 16,
  },
  gaugeStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  gaugeStat: { textAlign: 'center' },
  gsLabel: { display: 'block', fontSize: '0.68rem', color: '#64748b', marginBottom: 2 },
  gsValue: { fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', fontFamily: "'JetBrains Mono', monospace" },
  rulCard: {
    background: 'rgba(15,20,35,0.7)', border: '1px solid rgba(56,72,104,0.2)',
    borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 12,
  },
  rulHeader: { display: 'flex', alignItems: 'center', gap: 8 },
  rulTitle: { fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' },
  rulValue: { fontSize: '2rem', fontWeight: 900, color: '#e2e8f0', fontFamily: "'JetBrains Mono', monospace" },
  rulConfidence: { fontSize: '0.75rem', color: '#64748b' },
  rulBarTrack: {
    height: 6, background: 'rgba(56,72,104,0.2)', borderRadius: 3, overflow: 'hidden',
  },
  rulBarFill: { height: '100%', borderRadius: 3, transition: 'background 0.3s' },
  rulTicks: { display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b' },
  faultCard: {
    background: 'rgba(15,20,35,0.7)', border: '1px solid rgba(56,72,104,0.2)',
    borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 12,
  },
  cardTitle: { fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 4 },
  fpRow: { display: 'flex', alignItems: 'center', gap: 10 },
  fpName: { width: 80, fontSize: '0.78rem', color: '#94a3b8', flexShrink: 0 },
  fpBarTrack: { flex: 1, height: 6, background: 'rgba(56,72,104,0.2)', borderRadius: 3, overflow: 'hidden' },
  fpBarFill: { height: '100%', borderRadius: 3 },
  fpValue: { width: 35, textAlign: 'right', fontSize: '0.78rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 },
  chartCard: {
    background: 'rgba(15,20,35,0.7)', border: '1px solid rgba(56,72,104,0.2)',
    borderRadius: 14, padding: 20,
  },
  timelineCard: {
    background: 'rgba(15,20,35,0.7)', border: '1px solid rgba(56,72,104,0.2)',
    borderRadius: 14, padding: 24,
  },
  timelineEvents: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 },
  timelineItem: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
    background: 'rgba(20,26,42,0.4)', borderRadius: 8, border: '1px solid rgba(56,72,104,0.12)',
  },
  timelineDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  timelineContent: { flex: 1, display: 'flex', gap: 10, alignItems: 'center' },
  tlType: { fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', textTransform: 'capitalize' },
  tlComp: { fontSize: '0.72rem', color: '#64748b' },
  tlScore: { fontSize: '0.78rem', fontWeight: 600, color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace" },
  tlTime: { fontSize: '0.72rem', color: '#64748b', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 },
};

export default AnalyticsDashboard;
