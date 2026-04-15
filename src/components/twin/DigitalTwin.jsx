import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Eye, RotateCcw } from 'lucide-react';
import MachineModel from './MachineModel';
import ComponentPanel from './ComponentPanel';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const DigitalTwin = ({ machine, onComponentSelect }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [exploded, setExploded] = useState(false);

  const handleComponentClick = (comp) => {
    const matchedComp = machine.components.find(c => c.id === comp || c.name === comp);
    setSelectedComponent(matchedComp || null);
  };

  return (
    <section id="digital-twin" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-badge"><Box size={14} /> 3D Digital Twin</div>
            <h2 className="section-title">Interactive Machine Intelligence</h2>
            <p className="section-subtitle">
              Click any component to inspect health status, vibration data, and maintenance recommendations.
              The digital twin reflects real-time machine condition.
            </p>
          </motion.div>
        </div>

        <div style={styles.twinGrid}>
          {/* 3D Canvas */}
          <motion.div
            style={styles.canvasWrap}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={styles.canvasInner}>
              <Canvas camera={{ position: [5, 4, 6], fov: 40 }} gl={{ antialias: true }}>
                <ambientLight intensity={0.35} />
                <directionalLight position={[5, 8, 5]} intensity={0.7} castShadow />
                <directionalLight position={[-3, 2, -5]} intensity={0.25} color="#06b6d4" />
                <pointLight position={[0, 4, 0]} intensity={0.4} color="#06b6d4" distance={10} />

                <Suspense fallback={null}>
                  <MachineModel
                    components={machine.components}
                    onComponentClick={handleComponentClick}
                    exploded={exploded}
                    status={machine.status}
                  />
                </Suspense>

                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  maxPolarAngle={Math.PI / 1.8}
                  minPolarAngle={Math.PI / 6}
                  minDistance={4}
                  maxDistance={15}
                />
              </Canvas>

              {/* Canvas controls */}
              <div style={styles.canvasControls}>
                <button
                  style={{
                    ...styles.controlBtn,
                    background: exploded ? 'rgba(6,182,212,0.2)' : 'rgba(15,20,35,0.8)',
                    borderColor: exploded ? 'rgba(6,182,212,0.4)' : 'rgba(56,72,104,0.3)',
                  }}
                  onClick={() => setExploded(!exploded)}
                >
                  <Eye size={14} /> {exploded ? 'Assembled' : 'Exploded'} View
                </button>
                <button
                  style={styles.controlBtn}
                  onClick={() => setSelectedComponent(null)}
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </div>

              {/* Machine info bar */}
              <div style={styles.machineInfo}>
                <span style={styles.machineName}>{machine.name}</span>
                <span style={styles.machineType}>{machine.type}</span>
                <span style={{
                  ...styles.machineStatus,
                  color: machine.status === 'healthy' ? '#10b981' : machine.status === 'warning' ? '#f59e0b' : '#ef4444',
                  background: machine.status === 'healthy' ? 'rgba(16,185,129,0.1)' : machine.status === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                }}>
                  ● {machine.status.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Component Panel */}
          <div style={styles.panelWrap}>
            <AnimatePresence mode="wait">
              {selectedComponent ? (
                <ComponentPanel
                  key={selectedComponent.id}
                  component={selectedComponent}
                  onClose={() => setSelectedComponent(null)}
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={styles.placeholder}
                >
                  <Box size={40} color="#1e293b" />
                  <p style={styles.placeholderText}>Click any component on the 3D model to inspect its health data and maintenance status</p>
                  <div style={styles.componentList}>
                    {machine.components.map(comp => (
                      <button
                        key={comp.id}
                        style={styles.compBtn}
                        onClick={() => setSelectedComponent(comp)}
                      >
                        <span style={{
                          ...styles.compDot,
                          background: comp.risk === 'critical' ? '#ef4444' : comp.risk === 'high' ? '#f59e0b' : comp.risk === 'medium' ? '#f59e0b' : '#10b981',
                        }} />
                        {comp.name}
                        <span style={styles.compHealth}>{comp.health}%</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: { padding: '100px 0', position: 'relative', background: 'linear-gradient(180deg, #0a0e17 0%, #0f1420 100%)' },
  container: { maxWidth: 1280, margin: '0 auto', padding: '0 32px' },
  header: { textAlign: 'center', marginBottom: 48 },
  twinGrid: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, minHeight: 550 },
  canvasWrap: { position: 'relative' },
  canvasInner: {
    position: 'relative', height: '100%', minHeight: 500, borderRadius: 16,
    background: 'rgba(15,20,35,0.6)', border: '1px solid rgba(56,72,104,0.2)',
    overflow: 'hidden',
  },
  canvasControls: {
    position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8, zIndex: 10,
  },
  controlBtn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
    background: 'rgba(15,20,35,0.8)', border: '1px solid rgba(56,72,104,0.3)',
    borderRadius: 8, color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 500,
    cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s',
    fontFamily: "'Inter', sans-serif",
  },
  machineInfo: {
    position: 'absolute', bottom: 16, left: 16, display: 'flex',
    alignItems: 'center', gap: 12, zIndex: 10,
  },
  machineName: {
    fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0',
    background: 'rgba(15,20,35,0.8)', backdropFilter: 'blur(8px)',
    padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(56,72,104,0.2)',
  },
  machineType: {
    fontSize: '0.75rem', color: '#64748b',
  },
  machineStatus: {
    fontSize: '0.7rem', fontWeight: 600, padding: '4px 10px', borderRadius: 6,
    fontFamily: "'JetBrains Mono', monospace",
  },
  panelWrap: { display: 'flex', flexDirection: 'column' },
  placeholder: {
    height: '100%', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'flex-start', padding: 24,
    background: 'rgba(15,20,35,0.6)', border: '1px solid rgba(56,72,104,0.2)',
    borderRadius: 16, gap: 16, paddingTop: 40,
  },
  placeholderText: {
    color: '#64748b', fontSize: '0.85rem', textAlign: 'center', maxWidth: 280,
    lineHeight: 1.6,
  },
  componentList: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%', marginTop: 8 },
  compBtn: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
    background: 'rgba(20,26,42,0.6)', border: '1px solid rgba(56,72,104,0.15)',
    borderRadius: 8, color: '#e2e8f0', fontSize: '0.82rem',
    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
    fontFamily: "'Inter', sans-serif",
  },
  compDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  compHealth: {
    marginLeft: 'auto', fontSize: '0.75rem', color: '#64748b',
    fontFamily: "'JetBrains Mono', monospace",
  },
};

export default DigitalTwin;
