import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Radio, Activity, GitBranch, Monitor } from 'lucide-react';

const STEPS = [
  {
    id: 1, icon: Radio, color: '#06b6d4',
    title: 'Sensor Capture',
    desc: 'Vibration, temperature, and current sensors capture continuous machine telemetry at up to 12kHz.',
    detail: 'MEMS accelerometers · RTD temperature · CT current clamps',
  },
  {
    id: 2, icon: Cpu, color: '#8b5cf6',
    title: 'Edge Gateway',
    desc: 'Edge gateway preprocesses raw signals — anti-aliasing, decimation, and buffering for low latency.',
    detail: 'Raspberry Pi edge node · Buffered streaming · MQTT protocol',
  },
  {
    id: 3, icon: Activity, color: '#f59e0b',
    title: 'Feature Extraction',
    desc: 'Computes RMS, kurtosis, crest factor, spectral energy bands, and moving variance for each window.',
    detail: '512-sample windows · Overlap 50% · Hanning window applied',
  },
  {
    id: 4, icon: GitBranch, color: '#10b981',
    title: 'ML Inference',
    desc: 'Ensemble model performs anomaly detection and fault classification. Trained on CWRU benchmark data.',
    detail: 'Random Forest + Autoencoder · 97%+ accuracy on CWRU · Real-time inference',
  },
  {
    id: 5, icon: Monitor, color: '#ef4444',
    title: 'Digital Twin & Alerts',
    desc: 'Results update the 3D digital twin in real time. Critical faults trigger alerts and maintenance actions.',
    detail: 'WebSocket push · Mobile SMS alerts · Maintenance scheduling',
  },
];

const PipelineSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="pipeline" style={styles.section}>
      <div style={styles.container}>
        <motion.div style={styles.header}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-badge"><GitBranch size={14} /> System Pipeline</div>
          <h2 className="section-title">How FactoryShield AI Works</h2>
          <p className="section-subtitle">
            A 5-stage intelligent pipeline transforms raw vibration signals into predictive maintenance actions.
          </p>
        </motion.div>

        {/* Steps row */}
        <div style={styles.stepsRow}>
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <React.Fragment key={step.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    ...styles.stepCard,
                    border: isActive ? `1px solid ${step.color}50` : '1px solid rgba(56,72,104,0.2)',
                    boxShadow: isActive ? `0 0 24px ${step.color}20` : 'none',
                  }}
                  onClick={() => setActiveStep(idx)}
                >
                  <div style={{
                    ...styles.stepIcon,
                    background: `${step.color}18`,
                    border: `1px solid ${step.color}30`,
                  }}>
                    <Icon size={22} color={step.color} />
                  </div>
                  <div style={{ ...styles.stepNumber, color: step.color }}>0{step.id}</div>
                  <h3 style={{ ...styles.stepTitle, color: isActive ? '#e2e8f0' : '#94a3b8' }}>{step.title}</h3>
                  <p style={styles.stepDesc}>{step.desc}</p>
                  <div style={{ ...styles.stepDetail, background: `${step.color}08`, borderColor: `${step.color}20` }}>
                    {step.detail}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{ ...styles.activeBar, background: step.color }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
                {idx < STEPS.length - 1 && (
                  <div style={styles.connector}>
                    <motion.div
                      style={{ ...styles.connectorLine, background: idx < activeStep ? STEPS[idx].color : 'rgba(56,72,104,0.3)' }}
                      animate={{ opacity: idx < activeStep ? 1 : 0.3 }}
                    />
                    <div style={{ ...styles.arrow, color: idx < activeStep ? STEPS[idx].color : '#334155' }}>›</div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Active step detail */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={styles.detailBanner}
        >
          <div style={{ ...styles.detailIcon, background: `${STEPS[activeStep].color}18` }}>
            {React.createElement(STEPS[activeStep].icon, { size: 20, color: STEPS[activeStep].color })}
          </div>
          <div>
            <h4 style={{ color: STEPS[activeStep].color, fontSize: '0.9rem', fontWeight: 600 }}>
              Stage {activeStep + 1}: {STEPS[activeStep].title}
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>{STEPS[activeStep].desc}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const styles = {
  section: { padding: '100px 0', background: '#0f1420' },
  container: { maxWidth: 1280, margin: '0 auto', padding: '0 32px' },
  header: { textAlign: 'center', marginBottom: 56 },
  stepsRow: {
    display: 'flex', alignItems: 'stretch', gap: 0, marginBottom: 24, overflowX: 'auto',
  },
  stepCard: {
    flex: 1, minWidth: 160, background: 'rgba(15,20,35,0.6)', borderRadius: 14,
    padding: '24px 18px', cursor: 'pointer', position: 'relative',
    transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', gap: 10,
  },
  stepIcon: {
    width: 50, height: 50, borderRadius: 12, display: 'flex', alignItems: 'center',
    justifyContent: 'center', marginBottom: 4,
  },
  stepNumber: { fontSize: '1.6rem', fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 },
  stepTitle: { fontSize: '0.9rem', fontWeight: 700, transition: 'color 0.2s' },
  stepDesc: { fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, flex: 1 },
  stepDetail: {
    padding: '8px 10px', borderRadius: 8, border: '1px solid',
    fontSize: '0.68rem', color: '#64748b', lineHeight: 1.4,
    fontFamily: "'JetBrains Mono', monospace",
  },
  activeBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
    borderRadius: '0 0 14px 14px',
  },
  connector: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '0 8px', minWidth: 32,
  },
  connectorLine: { width: '100%', height: 1.5, borderRadius: 1, marginBottom: 4, transition: 'all 0.4s' },
  arrow: { fontSize: '1.2rem', fontWeight: 700, lineHeight: 1, transition: 'color 0.4s' },
  detailBanner: {
    display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px',
    background: 'rgba(15,20,35,0.5)', border: '1px solid rgba(56,72,104,0.2)',
    borderRadius: 12,
  },
  detailIcon: {
    width: 44, height: 44, borderRadius: 10, display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
};

export default PipelineSection;
