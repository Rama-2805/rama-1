import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, BarChart2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FAULT_CLASSES, ML_MODELS, generateDegradationTrend } from '../../data/cwruData';

const degradationData = generateDegradationTrend();

const DatasetSection = () => {
  const [activeFault, setActiveFault] = useState('normal');

  const faultClass = FAULT_CLASSES.find(f => f.id === activeFault) || FAULT_CLASSES[0];

  // Downsample waveform for display
  const waveformDisplay = faultClass.waveform
    .filter((_, i) => i % 4 === 0)
    .slice(0, 100);

  return (
    <section id="dataset" style={styles.section}>
      <div style={styles.container}>
        <motion.div style={styles.header}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <div className="section-badge"><Database size={14} /> Industrial Benchmark Intelligence</div>
          <h2 className="section-title">CWRU Bearing Dataset Analysis</h2>
          <p className="section-subtitle">
            Our maintenance intelligence is trained on real industrial benchmark vibration data from the
            Case Western Reserve University bearing dataset — the gold standard for bearing fault diagnosis.
          </p>
        </motion.div>

        {/* Fault class selector */}
        <div style={styles.faultTabs}>
          {FAULT_CLASSES.map(fc => (
            <button
              key={fc.id}
              style={{
                ...styles.faultTab,
                background: activeFault === fc.id ? `${fc.color}20` : 'rgba(20,26,42,0.4)',
                border: `1px solid ${activeFault === fc.id ? fc.color + '50' : 'rgba(56,72,104,0.2)'}`,
                color: activeFault === fc.id ? fc.color : '#94a3b8',
              }}
              onClick={() => setActiveFault(fc.id)}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: fc.color, display: 'inline-block' }} />
              {fc.name}
            </button>
          ))}
        </div>

        <div style={styles.mainGrid}>
          {/* Waveform + Spectrum */}
          <motion.div style={styles.chartCol}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            {/* Waveform */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>Time Domain — {faultClass.name}</span>
                <span style={{ ...styles.chipBadge, background: `${faultClass.color}15`, color: faultClass.color }}>
                  {faultClass.severity.toUpperCase()}
                </span>
              </div>
              <p style={styles.chartDesc}>{faultClass.description}</p>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waveformDisplay} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,72,104,0.15)" />
                    <XAxis dataKey="index" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip
                      contentStyle={{ background: '#0f1420', border: '1px solid rgba(56,72,104,0.3)', borderRadius: 8, fontSize: '0.75rem' }}
                      formatter={(v) => [v.toFixed(4), 'Amplitude (g)']}
                    />
                    <Line type="monotone" dataKey="amplitude" stroke={faultClass.color} dot={false} strokeWidth={1.5} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Spectrum */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>Frequency Domain — Power Spectrum</span>
              </div>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={faultClass.spectrum} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,72,104,0.15)" />
                    <XAxis dataKey="frequency" tickFormatter={v => `${Math.round(v)}Hz`} tick={{ fontSize: 9, fill: '#64748b' }} interval={2} />
                    <YAxis hide domain={[0, 1]} />
                    <Tooltip
                      contentStyle={{ background: '#0f1420', border: '1px solid rgba(56,72,104,0.3)', borderRadius: 8, fontSize: '0.75rem' }}
                      formatter={(v) => [v.toFixed(3), 'Power']}
                      labelFormatter={(l) => `${Math.round(l)} Hz`}
                    />
                    <Bar dataKey="power" fill={faultClass.color} radius={[2, 2, 0, 0]} isAnimationActive={false} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Feature table + degradation */}
          <motion.div style={styles.rightCol}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Feature extraction */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>Extracted Vibration Features</span>
              </div>
              <div style={styles.featureGrid}>
                {[
                  { label: 'RMS', value: faultClass.rms.toFixed(3), unit: 'g', desc: 'Root Mean Square — overall vibration energy' },
                  { label: 'Kurtosis', value: faultClass.kurtosis.toFixed(1), unit: '', desc: 'Impulsiveness indicator — healthy=3' },
                  { label: 'Crest Factor', value: faultClass.crestFactor.toFixed(1), unit: '', desc: 'Peak vs RMS ratio' },
                  { label: 'Peak-Peak', value: faultClass.peakToPeak.toFixed(3), unit: 'g', desc: 'Maximum signal swing' },
                  { label: 'Confidence', value: `${(faultClass.confidence * 100).toFixed(0)}%`, unit: '', desc: 'ML model classification confidence' },
                ].map(f => (
                  <div key={f.label} style={styles.featureRow}>
                    <span style={styles.featureLabel}>{f.label}</span>
                    <div style={{ flex: 1 }}>
                      <div style={styles.featureBar}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min(100, parseFloat(f.value) * 15)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8 }}
                          style={{ ...styles.featureBarFill, background: faultClass.color }}
                        />
                      </div>
                      <span style={styles.featureDesc}>{f.desc}</span>
                    </div>
                    <span style={{ ...styles.featureValue, color: faultClass.color }}>{f.value}{f.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ML Models */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>ML Model Performance</span>
                <BarChart2 size={14} color="#64748b" />
              </div>
              {ML_MODELS.map(m => (
                <div key={m.name} style={styles.mlRow}>
                  <div style={styles.mlInfo}>
                    <span style={styles.mlName}>{m.name}</span>
                    <span style={styles.mlType}>{m.type}</span>
                  </div>
                  <div style={styles.mlBarWrap}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.accuracy}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      style={styles.mlBarFill}
                    />
                  </div>
                  <span style={styles.mlAcc}>{m.accuracy}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Degradation trend — NASA IMS style */}
        <motion.div style={{ ...styles.chartCard, marginTop: 24 }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <div style={styles.chartHeader}>
            <span style={styles.chartTitle}>Bearing Degradation Progression — NASA IMS Style</span>
            <span style={styles.dataSource}>Based on Run-to-Failure dataset patterns</span>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={degradationData.slice(0, 60)} margin={{ top: 4, right: 20, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,72,104,0.15)" />
                <XAxis dataKey="hour" tickFormatter={v => `${v}h`} tick={{ fontSize: 10, fill: '#64748b' }} interval={9} />
                <YAxis yAxisId="rms" domain={[0, 1.2]} tick={{ fontSize: 10, fill: '#64748b' }} width={30} />
                <YAxis yAxisId="temp" orientation="right" domain={[40, 80]} tick={{ fontSize: 10, fill: '#64748b' }} width={30} />
                <Tooltip
                  contentStyle={{ background: '#0f1420', border: '1px solid rgba(56,72,104,0.3)', borderRadius: 8, fontSize: '0.75rem' }}
                  labelFormatter={(v) => `Hour ${v}`}
                />
                <Line yAxisId="rms" type="monotone" dataKey="rms" stroke="#06b6d4" dot={false} strokeWidth={2} name="RMS Vibration (g)" isAnimationActive={false} />
                <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#f59e0b" dot={false} strokeWidth={1.5} name="Temperature (°C)" isAnimationActive={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.degradLegend}>
            <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: '#06b6d4' }} />RMS Vibration</div>
            <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: '#f59e0b' }} />Temperature</div>
            <span style={styles.degradNote}>Rapid degradation onset visible at ~144 hours — typical of outer race crack propagation</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const styles = {
  section: { padding: '100px 0', background: '#0a0e17' },
  container: { maxWidth: 1280, margin: '0 auto', padding: '0 32px' },
  header: { textAlign: 'center', marginBottom: 40 },
  faultTabs: { display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' },
  faultTab: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
    borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
  },
  mainGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 },
  chartCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  chartCard: {
    background: 'rgba(15,20,35,0.7)', border: '1px solid rgba(56,72,104,0.2)',
    borderRadius: 14, padding: '20px',
  },
  chartHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  chartTitle: { fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' },
  chartDesc: { fontSize: '0.78rem', color: '#64748b', marginBottom: 12, lineHeight: 1.5 },
  chipBadge: {
    padding: '3px 10px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
  },
  featureGrid: { display: 'flex', flexDirection: 'column', gap: 14 },
  featureRow: { display: 'flex', alignItems: 'center', gap: 12 },
  featureLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', width: 80, flexShrink: 0 },
  featureBar: {
    height: 4, background: 'rgba(56,72,104,0.2)', borderRadius: 2, overflow: 'hidden', marginBottom: 3,
  },
  featureBarFill: { height: '100%', borderRadius: 2 },
  featureDesc: { fontSize: '0.65rem', color: '#64748b' },
  featureValue: {
    fontSize: '0.88rem', fontWeight: 700, width: 60, textAlign: 'right',
    fontFamily: "'JetBrains Mono', monospace", flexShrink: 0,
  },
  mlRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 },
  mlInfo: { width: 120, flexShrink: 0 },
  mlName: { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' },
  mlType: { fontSize: '0.65rem', color: '#64748b' },
  mlBarWrap: {
    flex: 1, height: 6, background: 'rgba(56,72,104,0.2)', borderRadius: 3, overflow: 'hidden',
  },
  mlBarFill: {
    height: '100%', borderRadius: 3,
    background: 'linear-gradient(90deg, #06b6d4, #0891b2)',
  },
  mlAcc: {
    width: 42, textAlign: 'right', fontSize: '0.8rem', fontWeight: 700, color: '#06b6d4',
    fontFamily: "'JetBrains Mono', monospace",
  },
  dataSource: { fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' },
  degradLegend: { display: 'flex', alignItems: 'center', gap: 20, marginTop: 12, flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#94a3b8' },
  legendDot: { width: 8, height: 8, borderRadius: '50%' },
  degradNote: { fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic', marginLeft: 'auto' },
};

export default DatasetSection;
