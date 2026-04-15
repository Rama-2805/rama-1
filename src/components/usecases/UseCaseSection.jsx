import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Clock, IndianRupee } from 'lucide-react';
import USE_CASES from '../../data/usecases';

const UseCaseSection = () => {
  return (
    <section id="usecases" style={styles.section}>
      <div style={styles.container}>
        <motion.div style={styles.header}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-badge"><MapPin size={14} /> MSME Use Cases</div>
          <h2 className="section-title">South India Manufacturing Clusters</h2>
          <p className="section-subtitle">
            FactoryShield AI is purpose-built for MSME industrial clusters across Karnataka and Tamil Nadu —
            where every unplanned hour of downtime costs real business.
          </p>
        </motion.div>

        <div style={styles.grid}>
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={uc.id}
              style={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, borderColor: 'rgba(6,182,212,0.25)' }}
            >
              <div style={styles.cardTop}>
                <span style={styles.emoji}>{uc.icon}</span>
                <div style={styles.locationBadge}>
                  <MapPin size={10} />
                  {uc.location}
                </div>
              </div>

              <h3 style={styles.title}>{uc.title}</h3>
              <p style={styles.desc}>{uc.description}</p>

              <div style={styles.machines}>
                <span style={styles.machinesLabel}>Machines:</span>
                <span style={styles.machinesText}>{uc.machines}</span>
              </div>

              <div style={styles.challengeBox}>
                <span style={styles.challengeLabel}>Challenge</span>
                <p style={styles.challengeText}>{uc.challenge}</p>
              </div>

              <div style={styles.impactGrid}>
                <div style={styles.impactItem}>
                  <Clock size={12} color="#10b981" />
                  <span style={styles.impactValue}>{uc.impact.downtime}</span>
                </div>
                <div style={styles.impactItem}>
                  <TrendingUp size={12} color="#06b6d4" />
                  <span style={styles.impactValue}>{uc.impact.efficiency}</span>
                </div>
                <div style={{ ...styles.impactItem, gridColumn: '1 / -1' }}>
                  <IndianRupee size={12} color="#f59e0b" />
                  <span style={{ ...styles.impactValue, color: '#f59e0b', fontWeight: 700 }}>{uc.impact.savings}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: { padding: '100px 0', background: '#0a0e17' },
  container: { maxWidth: 1280, margin: '0 auto', padding: '0 32px' },
  header: { textAlign: 'center', marginBottom: 48 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
  card: {
    background: 'rgba(15,20,35,0.7)', border: '1px solid rgba(56,72,104,0.2)',
    borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14,
    transition: 'all 0.3s ease', cursor: 'default',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  emoji: { fontSize: '2rem' },
  locationBadge: {
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', background: 'rgba(6,182,212,0.08)',
    border: '1px solid rgba(6,182,212,0.15)', borderRadius: 100,
    fontSize: '0.68rem', color: '#06b6d4', fontWeight: 600,
  },
  title: { fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.3 },
  desc: { fontSize: '0.8rem', color: '#64748b', lineHeight: 1.65 },
  machines: { display: 'flex', gap: 6, alignItems: 'baseline' },
  machinesLabel: { fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, flexShrink: 0 },
  machinesText: { fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' },
  challengeBox: {
    padding: '10px 12px', background: 'rgba(245,158,11,0.05)',
    border: '1px solid rgba(245,158,11,0.12)', borderRadius: 8,
  },
  challengeLabel: { fontSize: '0.65rem', fontWeight: 700, color: '#f59e0b', display: 'block', marginBottom: 4 },
  challengeText: { fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 },
  impactGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 'auto' },
  impactItem: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px',
    background: 'rgba(20,26,42,0.4)', borderRadius: 8,
  },
  impactValue: { fontSize: '0.72rem', color: '#e2e8f0', fontWeight: 500 },
};

export default UseCaseSection;
