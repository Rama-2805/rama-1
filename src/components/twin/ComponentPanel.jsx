import React from 'react';
import { motion } from 'framer-motion';
import { X, Activity, Thermometer, AlertTriangle, Wrench, Shield } from 'lucide-react';

const ComponentPanel = ({ component, onClose }) => {
  if (!component) return null;

  const getRiskStyle = (risk) => {
    switch(risk) {
      case 'critical': return { bg: 'var(--red-glow)', color: 'var(--red)', border: 'var(--red)' };
      case 'high': return { bg: 'var(--amber-glow)', color: 'var(--amber)', border: 'var(--amber)' };
      case 'medium': return { bg: 'var(--amber-dim)', color: 'var(--amber)', border: 'var(--amber)' };
      default: return { bg: 'var(--emerald-dim)', color: 'var(--emerald)', border: 'var(--emerald)' };
    }
  };

  const risk = getRiskStyle(component.risk);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={styles.panel}
    >
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>{component.name}</h3>
          <span style={{ ...styles.riskBadge, background: risk.bg, color: risk.color, borderColor: risk.border }}>
            {component.risk?.toUpperCase() || 'NONE'} RISK
          </span>
        </div>
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Health bar */}
      <div style={styles.healthSection}>
        <div style={styles.healthLabel}>
          <Shield size={14} color="#06b6d4" />
          <span>Component Health</span>
          <span style={styles.healthValue}>{component.health}%</span>
        </div>
        <div style={styles.healthTrack}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${component.health}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              ...styles.healthFill,
              background: component.health > 80 ? 'linear-gradient(90deg, var(--emerald), #059669)' :
                          component.health > 55 ? 'linear-gradient(90deg, var(--amber), #d97706)' :
                          'linear-gradient(90deg, var(--red), #dc2626)',
            }}
          />
        </div>
      </div>

      {/* Metrics grid */}
      <div style={styles.metricsGrid}>
        <div style={styles.metric}>
          <Activity size={14} color="#06b6d4" />
          <span style={styles.metricLabel}>Vibration</span>
          <span style={styles.metricValue}>{component.vibration} g</span>
        </div>
        <div style={styles.metric}>
          <Thermometer size={14} color="#f59e0b" />
          <span style={styles.metricLabel}>Temperature</span>
          <span style={styles.metricValue}>{component.temp}°C</span>
        </div>
        <div style={styles.metric}>
          <AlertTriangle size={14} color="#ef4444" />
          <span style={styles.metricLabel}>Anomaly Score</span>
          <span style={styles.metricValue}>{(component.anomaly * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Predicted Issue */}
      <div style={styles.issueSection}>
        <div style={styles.issueHeader}>
          <AlertTriangle size={14} color={risk.color} />
          <span style={styles.issueLabel}>Predicted Issue</span>
        </div>
        <p style={styles.issueText}>{component.issue}</p>
      </div>

      {/* Recommended Action */}
      <div style={styles.actionSection}>
        <div style={styles.issueHeader}>
          <Wrench size={14} color="#06b6d4" />
          <span style={styles.issueLabel}>Recommended Action</span>
        </div>
        <p style={styles.actionText}>{component.action}</p>
      </div>
    </motion.div>
  );
};

const styles = {
  panel: {
    background: 'var(--bg-card)', backdropFilter: 'blur(20px)',
    border: '1px solid var(--surface-border)', borderRadius: 16,
    padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 20,
    overflow: 'auto', transition: 'all 0.3s ease',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  title: {
    fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8,
  },
  riskBadge: {
    display: 'inline-block', padding: '3px 10px', borderRadius: 6,
    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px',
    border: '1px solid', fontFamily: "'JetBrains Mono', monospace",
  },
  closeBtn: {
    background: 'var(--surface-border)', border: '1px solid var(--surface-border)',
    borderRadius: 8, padding: 6, color: 'var(--text-muted)', cursor: 'pointer',
  },
  healthSection: { display: 'flex', flexDirection: 'column', gap: 8 },
  healthLabel: {
    display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem',
    color: 'var(--text-secondary)', fontWeight: 500,
  },
  healthValue: {
    marginLeft: 'auto', fontWeight: 700, color: 'var(--text-primary)',
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem',
  },
  healthTrack: {
    width: '100%', height: 6, background: 'var(--surface-border)', borderRadius: 3,
    overflow: 'hidden',
  },
  healthFill: { height: '100%', borderRadius: 3 },
  metricsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
  },
  metric: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    padding: '14px 8px', background: 'var(--bg-glass)',
    border: '1px solid var(--surface-border)', borderRadius: 10,
  },
  metricLabel: { fontSize: '0.7rem', color: 'var(--text-muted)' },
  metricValue: {
    fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  issueSection: {
    padding: '14px 16px', background: 'var(--amber-dim)',
    border: '1px solid var(--amber-glow)', borderRadius: 10,
  },
  issueHeader: {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
  },
  issueLabel: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' },
  issueText: { fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 },
  actionSection: {
    padding: '14px 16px', background: 'var(--cyan-dim)',
    border: '1px solid var(--surface-border)', borderRadius: 10,
  },
  actionText: { fontSize: '0.85rem', color: 'var(--cyan)', lineHeight: 1.5 },
};

export default ComponentPanel;
