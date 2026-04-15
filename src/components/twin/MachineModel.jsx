import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const COMPONENT_MAP = [
  { id: 'bearing-de', name: 'Drive-End Bearing', position: [0, 1.5, 0], geometry: 'torus', args: [0.45, 0.13, 16, 32] },
  { id: 'bearing-nde', name: 'Non-Drive-End Bearing', position: [0, -1.5, 0], geometry: 'torus', args: [0.45, 0.13, 16, 32] },
  { id: 'stator', name: 'Stator Winding', position: [0, 0, 0], geometry: 'cylinder', args: [1.25, 1.25, 2.4, 32, 1, true] },
  { id: 'rotor', name: 'Rotor Assembly', position: [0, 0, 0], geometry: 'cylinder', args: [0.7, 0.7, 2.2, 24] },
  { id: 'shaft', name: 'Drive Shaft', position: [0, 2.0, 0], geometry: 'cylinder', args: [0.15, 0.15, 1.6, 16] },
  { id: 'coupling', name: 'Shaft Coupling', position: [0, 2.85, 0], geometry: 'cylinder', args: [0.3, 0.3, 0.4, 16] },
];

function getHealthColor(components, id) {
  const comp = components?.find(c => c.id === id);
  if (!comp) return '#4b5563';
  if (comp.health > 80) return '#10b981';
  if (comp.health > 55) return '#f59e0b';
  return '#ef4444';
}

function getEmissiveIntensity(components, id) {
  const comp = components?.find(c => c.id === id);
  if (!comp) return 0.1;
  if (comp.risk === 'critical') return 0.6;
  if (comp.risk === 'high') return 0.4;
  if (comp.risk === 'medium') return 0.25;
  return 0.1;
}

function ComponentMesh({ componentDef, components, exploded, onComponentClick, hoveredId, setHoveredId }) {
  const meshRef = useRef();
  const color = getHealthColor(components, componentDef.id);
  const emissive = getEmissiveIntensity(components, componentDef.id);
  const isHovered = hoveredId === componentDef.id;

  const explodedOffset = useMemo(() => {
    if (!exploded) return [0, 0, 0];
    const [x, y, z] = componentDef.position;
    return [x * 0.5, y * 0.6, z * 0.5];
  }, [exploded, componentDef.position]);

  const finalPos = useMemo(() => {
    return componentDef.position.map((v, i) => v + explodedOffset[i]);
  }, [componentDef.position, explodedOffset]);

  useFrame(() => {
    if (meshRef.current) {
      const target = new THREE.Vector3(...finalPos);
      meshRef.current.position.lerp(target, 0.05);
    }
  });

  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  const GeometryComponent = ({ type, args }) => {
    switch (type) {
      case 'torus': return <torusGeometry args={args} />;
      case 'cylinder': return <cylinderGeometry args={args} />;
      case 'box': return <boxGeometry args={args} />;
      default: return <cylinderGeometry args={args} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={componentDef.position}
      onClick={(e) => { e.stopPropagation(); onComponentClick(componentDef.id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHoveredId(componentDef.id); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHoveredId(null); document.body.style.cursor = 'auto'; }}
      scale={isHovered ? 1.05 : 1}
    >
      <GeometryComponent type={componentDef.geometry} args={componentDef.args} />
      <meshStandardMaterial
        color={isHovered ? '#06b6d4' : threeColor}
        metalness={0.6}
        roughness={0.35}
        emissive={isHovered ? new THREE.Color('#06b6d4') : threeColor}
        emissiveIntensity={isHovered ? 0.5 : emissive}
        transparent={componentDef.geometry === 'cylinder' && componentDef.id === 'stator'}
        opacity={componentDef.id === 'stator' ? 0.5 : 1}
      />
    </mesh>
  );
}

function SensorNodes() {
  const positions = [
    [1.4, 0.6, 0], [1.4, -0.6, 0], [0, 1.6, 0.6], [-1.0, 0, 1.1], [0.5, -1.6, 0.5]
  ];

  return positions.map((pos, i) => (
    <Float key={i} speed={2.5 + i * 0.3} rotationIntensity={0} floatIntensity={0.25}>
      <group position={pos}>
        <mesh>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#06b6d4" transparent opacity={0.12} />
        </mesh>
      </group>
    </Float>
  ));
}

const MachineModel = ({ components, onComponentClick, exploded, status }) => {
  const groupRef = useRef();
  const [hoveredId, setHoveredId] = useState(null);

  useFrame(() => {
    if (groupRef.current && !hoveredId) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Motor shell - outer housing */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 2.5, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} transparent opacity={0.3} />
      </mesh>

      {/* Cooling fins */}
      {Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        return (
          <mesh key={`fin-${i}`} position={[Math.cos(angle) * 1.38, 0, Math.sin(angle) * 1.38]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.05, 2.2, 0.25]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
          </mesh>
        );
      })}

      {/* End caps */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[1.1, 1.38, 0.25, 32]} />
        <meshStandardMaterial color="#374151" metalness={0.75} roughness={0.35} />
      </mesh>
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[1.1, 1.38, 0.25, 32]} />
        <meshStandardMaterial color="#374151" metalness={0.75} roughness={0.35} />
      </mesh>

      {/* Interactive components */}
      {COMPONENT_MAP.map(compDef => (
        <ComponentMesh
          key={compDef.id}
          componentDef={compDef}
          components={components}
          exploded={exploded}
          onComponentClick={onComponentClick}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
        />
      ))}

      {/* Sensor nodes */}
      <SensorNodes />

      {/* Base plate */}
      <mesh position={[0, -2.2, 0]}>
        <boxGeometry args={[3.2, 0.15, 1.5]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[1.0, -1.85, 0]}>
        <boxGeometry args={[0.5, 0.55, 0.7]} />
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-1.0, -1.85, 0]}>
        <boxGeometry args={[0.5, 0.55, 0.7]} />
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Terminal box */}
      <mesh position={[0, 0.4, 1.45]}>
        <boxGeometry args={[0.55, 0.45, 0.28]} />
        <meshStandardMaterial color="#374151" metalness={0.65} roughness={0.4} />
      </mesh>
    </group>
  );
};

export default MachineModel;
