import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertTriangle, Clock, Wrench, TrendingDown, Thermometer, UserCheck, Activity, ChevronRight, CheckCircle } from 'lucide-react';
import { getRecommendationsForMachine } from '../../data/recommendations';

const ICON_MAP = {
  'alert-triangle': AlertTriangle,
  'trending-down': TrendingDown,
  'droplets': Activity,
  'wrench': Wrench,
  'user-check': UserCheck,
  'thermometer': Thermometer,
  'move': ChevronRight,
  'activity': Activity,
};

const PRIORITY_STYLE = {
  critical: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', accent: '#ef4444', label: 'CRITICAL' },
  high: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', accent: '#f59e0b', label: 'HIGH' },
  medium: { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)', accent: '#3b82f6', label: 'MEDIUM' },
  info: { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)', accent: '#10b981', label: 'INFO' },
};

const RecommendationCard = ({ rec, delay }) => {
  const [expanded, setExpanded] = useState(false);
  const IconComponent = ICON_MAP[rec.icon] || Activity;
  const style = PRIORITY_STYLE[rec.priority] || PRIORITY_STYLE.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{ ...styles.recCard, background: style.bg, borderColor: style.border }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={styles.recHeader}>
        <div style={{ ...styles.recIcon, background: `${style.accent}15` }}>
          <IconComponent size={16} color={style.accent} />
        </div>
        <div style={styles.recInfo}>
          <div style={styles.recTitleRow}>
            <span style={styles.recTitle}>{rec.title}</span>
            <span style={{ ...styles.recPriority, color: style.accent, borderColor: `${style.accent}30`, background: `${style.accent}10` }}>
              {style.label}
            </span>
          </div>
          <div style={styles.recMeta}>
            <Clock size={10} color="#64748b" />
            <span style={styles.recTime}>{rec.timeframe}</span>
            <span style={styles.recConf}>Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
        <ChevronRight size={14} color="#64748b" style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>

      <div style={styles.recConfBar}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${rec.confidence * 100}%` }}
          transition={{ delay: delay + 0.3, duration: 0.6 }}
          style={{ ...styles.recConfFill, background: style.accent }}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={styles.recExpanded}
          >
            <p style={styles.recDesc}>{rec.description}</p>
            <div style={styles.recActionBox}>
              <div style={styles.recActionLabel}><Wrench size={12} color="#06b6d4" /> Recommended Action</div>
              <p style={styles.recActionText}>{rec.action}</p>
            </div>
            <div style={styles.recImpactBox}>
              <div style={styles.recActionLabel}><CheckCircle size={12} color="#10b981" /> Business Impact</div>
              <p style={{ ...styles.recActionText, color: '#10b981' }}>{rec.impact}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AIAdvisor = ({ machine }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    setTyping(true);
    setRecommendations([]);
    const t = setTimeout(() => {
      setRecommendations(getRecommendationsForMachine(machine));
      setTyping(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [machine]);

  return (
    <section id="advisor" style={styles.section}>
      <div style={styles.container}>
        <motion.div style={styles.header}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-badge"><Brain size={14} /> AI Advisor</div>
          <h2 className="section-title">AI Maintenance Advisor</h2>
          <p className="section-subtitle">
            Context-aware maintenance intelligence powered by ML model analysis of vibration signatures,
            historical patterns, and CWRU dataset benchmarks.
          </p>
        </motion.div>

        <div style={styles.advisorGrid}>
          {/* Console panel */}
          <motion.div style={styles.console}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={styles.consoleHeader}>
              <div style={styles.consoleDots}>
                <div style={{ ...styles.dot, background: '#ef4444' }} />
                <div style={{ ...styles.dot, background: '#f59e0b' }} />
                <div style={{ ...styles.dot, background: '#10b981' }} />
              </div>
              <span style={styles.consoleTitle}>factoryshield-ai › maintenance-advisor</span>
            </div>
            <div style={styles.consoleBody}>
              <div style={styles.consoleLine}>
                <span style={styles.cPrompt}>$</span>
                <span style={styles.cText}>analyze {machine.id} --full-inspection</span>
              </div>
              <div style={styles.consoleLine}>
                <span style={styles.cGreen}>✓</span>
                <span style={styles.cText}>Loading CWRU baseline patterns...</span>
              </div>
              <div style={styles.consoleLine}>
                <span style={styles.cGreen}>✓</span>
                <span style={styles.cText}>Fetching live telemetry for {machine.name}...</span>
              </div>
              <div style={styles.consoleLine}>
                <span style={styles.cGreen}>✓</span>
                <span style={styles.cText}>Running Random Forest classifier...</span>
              </div>
              <div style={styles.consoleLine}>
                <span style={styles.cGreen}>✓</span>
                <span style={styles.cText}>Running Autoencoder anomaly detection...</span>
              </div>
              <div style={styles.consoleLine}>
                <span style={styles.cCyan}>→</span>
                <span style={styles.cText}>Health Score: <span style={{ color: machine.healthScore > 75 ? '#10b981' : machine.healthScore > 45 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{machine.healthScore}%</span></span>
              </div>
              <div style={styles.consoleLine}>
                <span style={styles.cCyan}>→</span>
                <span style={styles.cText}>Status: <span style={{ color: machine.status === 'healthy' ? '#10b981' : machine.status === 'warning' ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{machine.status.toUpperCase()}</span></span>
              </div>
              <div style={styles.consoleLine}>
                <span style={styles.cCyan}>→</span>
                <span style={styles.cText}>Generating {recommendations.length} maintenance actions...</span>
              </div>
              {typing && (
                <div style={styles.consoleLine}>
                  <span style={styles.cPrompt}>$</span>
                  <span style={styles.cursor}>▌</span>
                </div>
              )}
            </div>
            <div style={styles.consoleFooter}>
              <div style={styles.footerStat}><span style={styles.fLabel}>Model</span><span style={styles.fValue}>Random Forest + Autoencoder</span></div>
              <div style={styles.footerStat}><span style={styles.fLabel}>Dataset</span><span style={styles.fValue}>CWRU Bearing</span></div>
              <div style={styles.footerStat}><span style={styles.fLabel}>Latency</span><span style={styles.fValue}>142 ms</span></div>
            </div>
          </motion.div>

          {/* Recommendations */}
          <div style={styles.recList}>
            {typing ? (
              <div style={styles.analysing}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  style={styles.spinner}
                />
                <span style={styles.analysingText}>Analysing {machine.name}...</span>
              </div>
            ) : (
              recommendations.map((rec, i) => (
                <RecommendationCard key={rec.id} rec={rec} delay={i * 0.08} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: { padding: '100px 0', background: '#0a0e17' },
  container: { maxWidth: 1280, margin: '0 auto', padding: '0 32px' },
  header: { textAlign: 'center', marginBottom: 48 },
  advisorGrid: { display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'start' },
  console: {
    background: '#0a0c14', border: '1px solid rgba(56,72,104,0.3)',
    borderRadius: 14, overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace",
  },
  consoleHeader: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 16px', background: 'rgba(255,255,255,0.03)',
    borderBottom: '1px solid rgba(56,72,104,0.2)',
  },
  consoleDots: { display: 'flex', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: '50%' },
  consoleTitle: { fontSize: '0.72rem', color: '#64748b' },
  consoleBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 240 },
  consoleLine: { display: 'flex', gap: 10, alignItems: 'baseline' },
  cPrompt: { color: '#06b6d4', fontSize: '0.78rem' },
  cGreen: { color: '#10b981', fontSize: '0.78rem' },
  cCyan: { color: '#06b6d4', fontSize: '0.78rem' },
  cText: { color: '#94a3b8', fontSize: '0.78rem' },
  cursor: {
    color: '#06b6d4', fontSize: '0.88rem',
    animation: 'cursorBlink 1s infinite',
  },
  consoleFooter: {
    display: 'flex', padding: '12px 16px', gap: 24,
    borderTop: '1px solid rgba(56,72,104,0.2)',
    background: 'rgba(255,255,255,0.02)',
  },
  footerStat: { display: 'flex', flexDirection: 'column', gap: 2 },
  fLabel: { fontSize: '0.6rem', color: '#64748b' },
  fValue: { fontSize: '0.7rem', color: '#06b6d4' },
  recList: { display: 'flex', flexDirection: 'column', gap: 10 },
  recCard: {
    border: '1px solid', borderRadius: 12, padding: '14px 16px',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  recHeader: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  recIcon: { width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  recInfo: { flex: 1 },
  recTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  recTitle: { fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' },
  recPriority: { padding: '2px 8px', borderRadius: 5, fontSize: '0.6rem', fontWeight: 700, border: '1px solid', flexShrink: 0 },
  recMeta: { display: 'flex', alignItems: 'center', gap: 8 },
  recTime: { fontSize: '0.72rem', color: '#64748b' },
  recConf: { fontSize: '0.72rem', color: '#64748b', marginLeft: 'auto' },
  recConfBar: { height: 3, background: 'rgba(56,72,104,0.2)', borderRadius: 2, overflow: 'hidden', margin: '10px 0 0' },
  recConfFill: { height: '100%', borderRadius: 2 },
  recExpanded: { overflow: 'hidden' },
  recDesc: { fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6, marginTop: 12, marginBottom: 10 },
  recActionBox: {
    padding: '10px 12px', background: 'rgba(6,182,212,0.05)',
    border: '1px solid rgba(6,182,212,0.1)', borderRadius: 8, marginBottom: 8,
  },
  recActionLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', fontWeight: 600, color: '#64748b', marginBottom: 6 },
  recActionText: { fontSize: '0.8rem', color: '#06b6d4', lineHeight: 1.5 },
  recImpactBox: {
    padding: '10px 12px', background: 'rgba(16,185,129,0.05)',
    border: '1px solid rgba(16,185,129,0.1)', borderRadius: 8,
  },
  analysing: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 16, padding: 60,
  },
  spinner: {
    width: 32, height: 32, border: '3px solid rgba(56,72,104,0.3)',
    borderTop: '3px solid #06b6d4', borderRadius: '50%',
  },
  analysingText: { fontSize: '0.85rem', color: '#64748b', fontFamily: "'JetBrains Mono', monospace" },
};

export default AIAdvisor;
