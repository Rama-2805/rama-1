import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Factory, AlertTriangle, CheckCircle, Clock, Zap, Thermometer, Activity } from 'lucide-react';

const STATUS_FILTERS = ['all', 'healthy', 'warning', 'critical'];

const AssetCard = ({ machine, isSelected, onClick }) => {
  const statusColor = machine.status === 'healthy' ? '#10b981' : machine.status === 'warning' ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: `0 12px 40px ${statusColor}15` }}
      style={{
        ...styles.assetCard,
        border: isSelected ? `1px solid ${statusColor}50` : '1px solid rgba(56,72,104,0.2)',
        boxShadow: isSelected ? `0 0 24px ${statusColor}15` : 'none',
      }}
      onClick={onClick}
    >
      {/* Status indicator strip */}
      <div style={{ ...styles.statusStrip, background: statusColor }} />

      <div style={styles.cardTop}>
        <div>
          <h3 style={styles.machineName}>{machine.name}</h3>
          <p style={styles.machineType}>{machine.type}</p>
          <p style={styles.machineLocation}>{machine.location}</p>
        </div>
        <div style={{ ...styles.healthBadge, background: `${statusColor}15`, color: statusColor }}>
          {machine.healthScore}%
        </div>
      </div>

      {/* Health bar */}
      <div style={styles.healthBar}>
        <div style={{
          ...styles.healthFill,
          width: `${machine.healthScore}%`,
          background: machine.healthScore > 75 ? 'linear-gradient(90deg,#10b981,#059669)' :
                      machine.healthScore > 45 ? 'linear-gradient(90deg,#f59e0b,#d97706)' :
                      'linear-gradient(90deg,#ef4444,#dc2626)',
        }} />
      </div>

      {/* Metrics grid */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricItem}>
          <Activity size={12} color="#06b6d4" />
          <span style={styles.metricVal}>{machine.vibration}g</span>
          <span style={styles.metricLbl}>Vibration</span>
        </div>
        <div style={styles.metricItem}>
          <Thermometer size={12} color="#f59e0b" />
          <span style={styles.metricVal}>{machine.temperature}°C</span>
          <span style={styles.metricLbl}>Temp</span>
        </div>
        <div style={styles.metricItem}>
          <Zap size={12} color="#8b5cf6" />
          <span style={styles.metricVal}>{machine.current}A</span>
          <span style={styles.metricLbl}>Current</span>
        </div>
        <div style={styles.metricItem}>
          <Clock size={12} color="#64748b" />
          <span style={styles.metricVal}>{machine.load}%</span>
          <span style={styles.metricLbl}>Load</span>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.cardFooter}>
        <span style={styles.nextMaint}>
          <Clock size={10} /> Next: {new Date(machine.nextMaintenance).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
        <span style={{ ...styles.statusLabel, color: statusColor }}>
          {machine.status === 'healthy' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
          {machine.status.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
};

const FactoryFloor = ({ machines, selectedMachine, onSelectMachine }) => {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? machines : machines.filter(m => m.status === filter);

  const counts = {
    healthy: machines.filter(m => m.status === 'healthy').length,
    warning: machines.filter(m => m.status === 'warning').length,
    critical: machines.filter(m => m.status === 'critical').length,
  };

  return (
    <section id="factory" style={styles.section}>
      <div style={styles.container}>
        <motion.div style={styles.header}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-badge"><Factory size={14} /> Factory Floor</div>
          <h2 className="section-title">Asset Health Overview</h2>
          <p className="section-subtitle">Monitor all factory assets at a glance. Click any machine to load detailed analytics.</p>
        </motion.div>

        {/* Summary stats */}
        <div style={styles.summaryRow}>
          {[
            { label: 'Total Assets', value: machines.length, color: '#06b6d4' },
            { label: 'Healthy', value: counts.healthy, color: '#10b981' },
            { label: 'Warning', value: counts.warning, color: '#f59e0b' },
            { label: 'Critical', value: counts.critical, color: '#ef4444' },
          ].map(s => (
            <div key={s.label} style={styles.summaryCard}>
              <span style={{ ...styles.summaryValue, color: s.color }}>{s.value}</span>
              <span style={styles.summaryLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={styles.filterTabs}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                background: filter === f ? 'rgba(6,182,212,0.12)' : 'rgba(20,26,42,0.4)',
                border: `1px solid ${filter === f ? 'rgba(6,182,212,0.3)' : 'rgba(56,72,104,0.2)'}`,
                color: filter === f ? '#06b6d4' : '#94a3b8',
              }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && <span style={styles.filterCount}>{counts[f]}</span>}
            </button>
          ))}
        </div>

        {/* Asset grid */}
        <div style={styles.assetGrid}>
          {filtered.map(m => (
            <AssetCard
              key={m.id}
              machine={m}
              isSelected={selectedMachine?.id === m.id}
              onClick={() => onSelectMachine(m)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: { padding: '100px 0', background: '#0f1420' },
  container: { maxWidth: 1280, margin: '0 auto', padding: '0 32px' },
  header: { textAlign: 'center', marginBottom: 40 },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
  summaryCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    padding: '18px', background: 'rgba(15,20,35,0.6)',
    border: '1px solid rgba(56,72,104,0.2)', borderRadius: 12,
  },
  summaryValue: { fontSize: '2rem', fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" },
  summaryLabel: { fontSize: '0.75rem', color: '#64748b' },
  filterTabs: { display: 'flex', gap: 10, marginBottom: 24 },
  filterBtn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px',
    borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
  },
  filterCount: {
    background: 'rgba(255,255,255,0.08)', borderRadius: 10,
    padding: '1px 7px', fontSize: '0.7rem',
  },
  assetGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 },
  assetCard: {
    background: 'rgba(15,20,35,0.7)', borderRadius: 14, padding: '18px 18px 16px',
    cursor: 'pointer', position: 'relative', overflow: 'hidden',
    transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', gap: 12,
  },
  statusStrip: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  machineName: { fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 2 },
  machineType: { fontSize: '0.72rem', color: '#64748b', marginBottom: 2 },
  machineLocation: { fontSize: '0.68rem', color: '#475569' },
  healthBadge: {
    padding: '6px 12px', borderRadius: 8, fontSize: '1rem',
    fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
  },
  healthBar: { height: 4, background: 'rgba(56,72,104,0.2)', borderRadius: 2, overflow: 'hidden' },
  healthFill: { height: '100%', borderRadius: 2 },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 },
  metricItem: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    padding: '8px 4px', background: 'rgba(20,26,42,0.4)', borderRadius: 8,
  },
  metricVal: { fontSize: '0.72rem', fontWeight: 700, color: '#e2e8f0', fontFamily: "'JetBrains Mono', monospace" },
  metricLbl: { fontSize: '0.55rem', color: '#64748b' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nextMaint: {
    display: 'flex', alignItems: 'center', gap: 5,
    fontSize: '0.68rem', color: '#64748b',
  },
  statusLabel: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px',
  },
};

export default FactoryFloor;
