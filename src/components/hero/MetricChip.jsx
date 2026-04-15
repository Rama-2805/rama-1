import React from 'react';
import { motion } from 'framer-motion';

const MetricChip = ({ label, value, unit, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay + 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={styles.chip}
      whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(6,182,212,0.2)' }}
    >
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3 + delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span style={styles.value}>{value}</span>
        {unit && <span style={styles.unit}>{unit}</span>}
        <div style={styles.label}>{label}</div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  chip: {
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(16px)',
    border: '1px solid var(--surface-border)',
    borderRadius: 14,
    padding: '14px 20px',
    minWidth: 140,
    textAlign: 'center',
    cursor: 'default',
  },
  value: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: 'var(--cyan)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  unit: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginLeft: 4,
    fontFamily: "'JetBrains Mono', monospace",
  },
  label: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    marginTop: 4,
    fontWeight: 500,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
};

export default MetricChip;
