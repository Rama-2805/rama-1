import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import HeroMachine from './HeroMachine';
import MetricChip from './MetricChip';

const HeroSection = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" style={styles.section}>
      {/* Background effects */}
      <div style={styles.bgGradient} />
      <div style={styles.gridOverlay} />

      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Left: Content */}
          <motion.div
            style={styles.content}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              style={styles.badge}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Zap size={14} />
              <span>Edge AI × Digital Twin × Predictive Maintenance</span>
            </motion.div>

            <h1 style={styles.headline}>
              Factory<span style={styles.accent}>Shield</span> AI
            </h1>

            <h2 style={styles.subheadline}>
              Edge AI predictive maintenance for MSME factories
            </h2>

            <p style={styles.description}>
              Predict breakdowns before production stops. FactoryShield AI combines real vibration
              intelligence from industrial bearing datasets with live sensor monitoring and cinematic
              3D digital twin visualization to transform maintenance from reactive repair into
              predictive action.
            </p>

            <div style={styles.buttons}>
              <button style={styles.btnPrimary} onClick={() => scrollTo('digital-twin')}>
                Launch Digital Twin <ArrowRight size={16} />
              </button>
              <button style={styles.btnSecondary} onClick={() => scrollTo('live-sensor')}>
                View Live Sensor Demo
              </button>
            </div>

            {/* Metric chips row */}
            <div style={styles.metrics}>
              <MetricChip label="Health Score" value="91" unit="%" delay={0} />
              <MetricChip label="Bearing Vibration" value="0.72" unit="g" delay={0.1} />
              <MetricChip label="Failure Risk" value="18" unit="%" delay={0.2} />
              <MetricChip label="Temp Drift" value="+7" unit="°C" delay={0.3} />
              <MetricChip label="Maint. Window" value="72" unit="hrs" delay={0.4} />
            </div>
          </motion.div>

          {/* Right: 3D Machine */}
          <motion.div
            style={styles.machineWrap}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense fallback={<div style={styles.loadingFallback}>Loading 3D Engine...</div>}>
              <HeroMachine health={0.91} />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: 80,
    paddingBottom: 40,
  },
  bgGradient: {
    position: 'absolute', inset: 0,
    background: `
      radial-gradient(ellipse 80% 60% at 20% 40%, rgba(6,182,212,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 60%, rgba(139,92,246,0.04) 0%, transparent 60%)
    `,
  },
  gridOverlay: {
    position: 'absolute', inset: 0,
    backgroundImage: `
      linear-gradient(rgba(56,72,104,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,72,104,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
  },
  container: {
    maxWidth: 1280, margin: '0 auto', padding: '0 32px', width: '100%',
    position: 'relative', zIndex: 1,
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center',
  },
  content: {
    display: 'flex', flexDirection: 'column', gap: 0,
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '6px 16px', background: 'rgba(6,182,212,0.08)',
    border: '1px solid rgba(6,182,212,0.2)', borderRadius: 100,
    fontSize: '0.72rem', fontWeight: 600, color: '#06b6d4',
    textTransform: 'uppercase', letterSpacing: '1.2px',
    marginBottom: 24, alignSelf: 'flex-start',
  },
  headline: {
    fontSize: '4.2rem', fontWeight: 900, color: '#e2e8f0',
    lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 16,
  },
  accent: {
    color: '#06b6d4',
    textShadow: '0 0 40px rgba(6,182,212,0.3)',
  },
  subheadline: {
    fontSize: '1.25rem', fontWeight: 500, color: '#94a3b8',
    marginBottom: 20, lineHeight: 1.5,
  },
  description: {
    fontSize: '0.95rem', color: '#64748b', lineHeight: 1.8,
    maxWidth: 520, marginBottom: 32,
  },
  buttons: {
    display: 'flex', gap: 14, marginBottom: 40, flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '14px 32px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600,
    background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff',
    border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 24px rgba(6,182,212,0.3)',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', sans-serif",
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '14px 32px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600,
    background: 'transparent', color: '#e2e8f0',
    border: '1px solid rgba(56,72,104,0.4)', cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', sans-serif",
  },
  metrics: {
    display: 'flex', gap: 10, flexWrap: 'wrap',
  },
  machineWrap: {
    height: 550, position: 'relative',
  },
  loadingFallback: {
    width: '100%', height: '100%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    color: '#64748b', fontSize: '0.9rem',
    fontFamily: "'JetBrains Mono', monospace",
  },
};

export default HeroSection;
