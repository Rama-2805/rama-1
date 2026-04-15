import React from 'react';
import { motion } from 'framer-motion';
import { X, Activity, Thermometer, AlertTriangle, Wrench, Shield } from 'lucide-react';

const ComponentPanel = ({ component, onClose }) => {
  if (!component) return null;

  const getRiskStyle = (risk) => {
    switch(risk) {
      case 'critical': return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' };
      case 'high': return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' };
      case 'medium': return { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' };
      default: return { bg: 'rgba(16,185,129,0.08)', color: '#10b981', border: 'rgba(16,185,129,0.2)' };
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
              background: component.health > 80 ? 'linear-gradient(90deg, #10b981, #059669)' :
                          component.health > 55 ? 'linear-gradient(90deg, #f59e0b, #d97706)' :
                          'linear-gradient(90deg, #ef4444, #dc2626)',
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
    background: 'rgba(15, 20, 35, 0.85)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(56,72,104,0.25)', borderRadius: 16,
    padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 20,
    overflow: 'auto',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  title: {
    fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 8,
  },
  riskBadge: {
    display: 'inline-block', padding: '3px 10px', borderRadius: 6,
    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px',
    border: '1px solid', fontFamily: "'JetBrains Mono', monospace",
  },
  closeBtn: {
    background: 'rgba(56,72,104,0.2)', border: '1px solid rgba(56,72,104,0.2)',
    borderRadius: 8, padding: 6, color: '#94a3b8', cursor: 'pointer',
  },
  healthSection: { display: 'flex', flexDirection: 'column', gap: 8 },
  healthLabel: {
    display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem',
    color: '#94a3b8', fontWeight: 500,
  },
  healthValue: {
    marginLeft: 'auto', fontWeight: 700, color: '#e2e8f0',
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem',
  },
  healthTrack: {
    width: '100%', height: 6, background: 'rgba(56,72,104,0.2)', borderRadius: 3,
    overflow: 'hidden',
  },
  healthFill: { height: '100%', borderRadius: 3 },
  metricsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
  },
  metric: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    padding: '14px 8px', background: 'rgba(20,26,42,0.5)',
    border: '1px solid rgba(56,72,104,0.15)', borderRadius: 10,
  },
  metricLabel: { fontSize: '0.7rem', color: '#64748b' },
  metricValue: {
    fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0',
    fontFamily: "'JetBrains Mono', monospace",
  },
  issueSection: {
    padding: '14px 16px', background: 'rgba(245,158,11,0.05)',
    border: '1px solid rgba(245,158,11,0.1)', borderRadius: 10,
  },
  issueHeader: {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
  },
  issueLabel: { fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' },
  issueText: { fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5 },
  actionSection: {
    padding: '14px 16px', background: 'rgba(6,182,212,0.05)',
    border: '1px solid rgba(6,182,212,0.1)', borderRadius: 10,
  },
  actionText: { fontSize: '0.85rem', color: '#06b6d4', lineHeight: 1.5 },
};

export default ComponentPanel;
