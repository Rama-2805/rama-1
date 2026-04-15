import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Eye, Wifi, Shield } from 'lucide-react';

const CTASection = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="cta" style={styles.section}>
      <div style={styles.bgGlow} />
      <div style={styles.bgGlow2} />
      <div style={styles.gridOverlay} />

      <div style={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={styles.content}
        >
          <div style={styles.badge}>
            <Shield size={14} />
            <span>FactoryShield AI · Built for Bharat's MSME Factories</span>
          </div>

          <h2 style={styles.headline}>
            From reactive maintenance to<br />
            <span style={styles.accent}>predictive intelligence.</span>
          </h2>

          <p style={styles.tagline}>
            "Predict breakdowns before production stops."
          </p>

          <p style={styles.desc}>
            We trained the maintenance intelligence on real industrial bearing datasets and use the
            smartphone accelerometer as a low-cost live sensing prototype to demonstrate how
            FactoryShield AI can monitor vibration in real time.
          </p>

          <div style={styles.buttons}>
            <motion.button
              style={styles.btnPrimary}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 40px rgba(6,182,212,0.45)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar size={16} /> Schedule Demo
            </motion.button>
            <motion.button
              style={styles.btnSecondary}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollTo('digital-twin')}
            >
              <Eye size={16} /> Explore Digital Twin
            </motion.button>
            <motion.button
              style={styles.btnOutline}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollTo('live-sensor')}
            >
              <Wifi size={16} /> See Live Vibration Feed
            </motion.button>
          </div>

          {/* Stats row */}
          <div style={styles.statsRow}>
            {[
              { value: '97.2%', label: 'ML model accuracy on CWRU dataset' },
              { value: '< 200ms', label: 'Edge-to-dashboard latency' },
              { value: '4 fault classes', label: 'inner race · outer race · ball · normal' },
              { value: '₹5+ lakh', label: 'average annual savings per production line' },
            ].map(s => (
              <div key={s.label} style={styles.stat}>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <Shield size={18} color="#06b6d4" />
            <span style={styles.footerBrandText}>FactoryShield<span style={{ color: '#06b6d4' }}>AI</span></span>
          </div>
          <span style={styles.footerTagline}>Edge AI Predictive Maintenance for MSME Factories</span>
          <span style={styles.footerNote}>Hackathon Demo · Dataset: CWRU Bearing · Built with React + Three.js</span>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '120px 0 0', background: '#0f1420', position: 'relative', overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
    width: 800, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute', top: '40%', left: '20%',
    width: 400, height: 400, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  gridOverlay: {
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(rgba(56,72,104,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56,72,104,0.05) 1px, transparent 1px)`,
    backgroundSize: '60px 60px', pointerEvents: 'none',
  },
  container: { maxWidth: 1000, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 },
  content: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '6px 16px', background: 'rgba(6,182,212,0.08)',
    border: '1px solid rgba(6,182,212,0.2)', borderRadius: 100,
    fontSize: '0.72rem', fontWeight: 600, color: '#06b6d4',
    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 28,
  },
  headline: {
    fontSize: '3.5rem', fontWeight: 900, color: '#e2e8f0',
    lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 20,
  },
  accent: {
    color: '#06b6d4', textShadow: '0 0 40px rgba(6,182,212,0.3)',
  },
  tagline: {
    fontSize: '1.15rem', fontStyle: 'italic', color: '#94a3b8',
    marginBottom: 20, fontWeight: 500,
  },
  desc: {
    fontSize: '0.9rem', color: '#64748b', lineHeight: 1.8, maxWidth: 680, marginBottom: 40,
  },
  buttons: {
    display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60,
  },
  btnPrimary: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '15px 36px',
    background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff',
    border: 'none', borderRadius: 12, fontSize: '0.92rem', fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 4px 28px rgba(6,182,212,0.3)',
    fontFamily: "'Inter', sans-serif",
  },
  btnSecondary: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '15px 36px',
    background: 'rgba(6,182,212,0.08)', color: '#06b6d4',
    border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12,
    fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  btnOutline: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '15px 36px',
    background: 'transparent', color: '#94a3b8',
    border: '1px solid rgba(56,72,104,0.3)', borderRadius: 12,
    fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, width: '100%', marginBottom: 80,
  },
  stat: { textAlign: 'center', padding: '20px 16px', background: 'rgba(15,20,35,0.6)', border: '1px solid rgba(56,72,104,0.15)', borderRadius: 12 },
  statValue: { display: 'block', fontSize: '1.4rem', fontWeight: 900, color: '#06b6d4', fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 },
  statLabel: { fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 },
  footer: {
    borderTop: '1px solid rgba(56,72,104,0.15)',
    padding: '28px 32px', marginTop: 0,
  },
  footerInner: {
    maxWidth: 1280, margin: '0 auto',
    display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
  },
  footerBrand: { display: 'flex', alignItems: 'center', gap: 8 },
  footerBrandText: { fontSize: '1rem', fontWeight: 700, color: '#e2e8f0' },
  footerTagline: { fontSize: '0.8rem', color: '#64748b' },
  footerNote: { fontSize: '0.72rem', color: '#475569', marginLeft: 'auto', fontStyle: 'italic' },
};

export default CTASection;
