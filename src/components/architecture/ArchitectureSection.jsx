import React from 'react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

const NODES = [
  { id: 'phone', label: 'Smartphone\nAccelerometer', sublabel: 'Low-cost prototype', color: '#8b5cf6', x: 5, y: 15 },
  { id: 'sensor', label: 'Industrial IoT\nSensors', sublabel: 'Accelerometer · Temp · CT', color: '#06b6d4', x: 5, y: 55 },
  { id: 'edge', label: 'Edge Gateway', sublabel: 'Signal preprocessing', color: '#06b6d4', x: 28, y: 35 },
  { id: 'feature', label: 'Feature Extraction\nEngine', sublabel: 'RMS · Kurtosis · FFT', color: '#f59e0b', x: 52, y: 35 },
  { id: 'ml', label: 'ML Model\nService', sublabel: 'RF + Autoencoder', color: '#10b981', x: 73, y: 20 },
  { id: 'twin', label: '3D Digital Twin\nVisualization', sublabel: 'Real-time dashboard', color: '#06b6d4', x: 73, y: 55 },
  { id: 'cloud', label: 'Cloud Analytics\nDashboard', sublabel: 'Historical · Trends', color: '#3b82f6', x: 90, y: 35 },
];

const EDGES = [
  { from: 'phone', to: 'edge', label: 'BroadcastChannel / WS' },
  { from: 'sensor', to: 'edge', label: 'MQTT / Modbus' },
  { from: 'edge', to: 'feature', label: 'Raw signal buffer' },
  { from: 'feature', to: 'ml', label: 'Feature vector' },
  { from: 'feature', to: 'twin', label: 'Processed data' },
  { from: 'ml', to: 'twin', label: 'Fault class + score' },
  { from: 'ml', to: 'cloud', label: 'Inference results' },
  { from: 'twin', to: 'cloud', label: 'State sync' },
];

function getNodePos(id, nodes) {
  const n = nodes.find(n => n.id === id);
  return n ? { x: n.x, y: n.y } : { x: 50, y: 50 };
}

const ArchitectureSection = () => {
  return (
    <section id="architecture" style={styles.section}>
      <div style={styles.container}>
        <motion.div style={styles.header}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-badge"><Network size={14} /> System Architecture</div>
          <h2 className="section-title">Platform Architecture</h2>
          <p className="section-subtitle">
            A complete edge-to-cloud architecture connecting physical sensors to digital twin intelligence.
          </p>
        </motion.div>

        {/* Architecture SVG diagram */}
        <motion.div style={styles.diagramWrap}
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <svg viewBox="0 0 100 75" style={styles.svg} preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(56,72,104,0.6)" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {EDGES.map((edge, i) => {
              const from = getNodePos(edge.from, NODES);
              const to = getNodePos(edge.to, NODES);
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;
              return (
                <g key={i}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke="rgba(56,72,104,0.35)" strokeWidth="0.4"
                    strokeDasharray="2 1"
                    markerEnd="url(#arrow)"
                  />
                  <text x={mx} y={my - 1} textAnchor="middle" fontSize="1.5" fill="#475569">{edge.label}</text>
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node, i) => (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <circle cx={node.x} cy={node.y} r="5.5" fill={`${node.color}18`} stroke={`${node.color}50`} strokeWidth="0.5" filter="url(#glow)" />
                <circle cx={node.x} cy={node.y} r="2.5" fill={node.color} opacity="0.9" />
                {node.label.split('\n').map((line, li) => (
                  <text key={li} x={node.x} y={node.y + 8 + li * 3} textAnchor="middle" fontSize="2.2" fill="#e2e8f0" fontWeight="600">
                    {line}
                  </text>
                ))}
                <text x={node.x} y={node.y + 16} textAnchor="middle" fontSize="1.6" fill="#64748b">
                  {node.sublabel}
                </text>
              </motion.g>
            ))}
          </svg>
        </motion.div>

        {/* Layer legend */}
        <div style={styles.layers}>
          {[
            { label: 'Sensing Layer', color: '#8b5cf6', items: ['Phone Accelerometer (HTTPS)', 'Industrial IoT Sensors', 'Vibration · Temperature · Current'] },
            { label: 'Processing Layer', color: '#06b6d4', items: ['Edge Gateway (Raspberry Pi)', 'Feature Extraction Engine', 'Anti-aliasing · Windowing · RMS'] },
            { label: 'Intelligence Layer', color: '#10b981', items: ['Random Forest Classifier', 'Autoencoder Anomaly Detector', 'CWRU-trained models · 97%+ accuracy'] },
            { label: 'Visualization Layer', color: '#3b82f6', items: ['3D Digital Twin', 'Cloud Analytics', 'Mobile Alerts · Maintenance Queue'] },
          ].map((layer, i) => (
            <motion.div
              key={layer.label}
              style={{ ...styles.layerCard, borderColor: `${layer.color}25` }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ ...styles.layerDot, background: layer.color }} />
              <div>
                <div style={styles.layerLabel}>{layer.label}</div>
                {layer.items.map(item => (
                  <div key={item} style={styles.layerItem}>· {item}</div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: { padding: '100px 0', background: '#0f1420' },
  container: { maxWidth: 1280, margin: '0 auto', padding: '0 32px' },
  header: { textAlign: 'center', marginBottom: 48 },
  diagramWrap: {
    background: 'rgba(15,20,35,0.6)', border: '1px solid rgba(56,72,104,0.2)',
    borderRadius: 16, padding: '32px 24px', marginBottom: 32, overflow: 'hidden',
  },
  svg: { width: '100%', height: 'auto', maxHeight: 380 },
  layers: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  layerCard: {
    display: 'flex', gap: 14, padding: '20px',
    background: 'rgba(15,20,35,0.5)', border: '1px solid',
    borderRadius: 12,
  },
  layerDot: { width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0 },
  layerLabel: { fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 8 },
  layerItem: { fontSize: '0.72rem', color: '#64748b', lineHeight: 1.8 },
};

export default ArchitectureSection;
