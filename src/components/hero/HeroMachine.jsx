import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ---- Procedural Industrial Motor Model ---- */
function MotorBody({ health = 1 }) {
  const groupRef = useRef();
  const glowRef = useRef();

  const healthColor = useMemo(() => {
    if (health > 0.7) return new THREE.Color('#10b981');
    if (health > 0.4) return new THREE.Color('#f59e0b');
    return new THREE.Color('#ef4444');
  }, [health]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main motor housing */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 2.4, 32]} />
        <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* End bells */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[1.0, 1.25, 0.3, 32]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[1.0, 1.25, 0.3, 32]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Drive shaft */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.5, 16]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Cooling fins */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={`fin-${i}`} position={[Math.cos(angle) * 1.25, 0, Math.sin(angle) * 1.25]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.08, 2.0, 0.3]} />
            <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.5} />
          </mesh>
        );
      })}

      {/* Bearing housings */}
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[0.4, 0.12, 16, 32]} />
        <meshStandardMaterial color={healthColor} metalness={0.5} roughness={0.4} emissive={healthColor} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <torusGeometry args={[0.4, 0.12, 16, 32]} />
        <meshStandardMaterial color={healthColor} metalness={0.5} roughness={0.4} emissive={healthColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Sensor nodes */}
      {[
        [1.35, 0.5, 0],
        [1.35, -0.5, 0],
        [0, 1.55, 0.5],
        [-1.0, 0, 1.0],
      ].map((pos, i) => (
        <Float key={`sensor-${i}`} speed={3} rotationIntensity={0} floatIntensity={0.3}>
          <mesh position={pos}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} />
          </mesh>
          <mesh ref={i === 0 ? glowRef : null} position={pos}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#06b6d4" transparent opacity={0.15} />
          </mesh>
        </Float>
      ))}

      {/* Junction box */}
      <mesh position={[0, 0.3, 1.35]}>
        <boxGeometry args={[0.5, 0.4, 0.25]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Mounting feet */}
      <mesh position={[0.8, -1.7, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.8, -1.7, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ---- Floating Particles ---- */
function Particles() {
  const pointsRef = useRef();
  const count = 150;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
      pointsRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#06b6d4" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* ---- Hero Machine Canvas ---- */
const HeroMachine = ({ health = 0.91 }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 400 }}>
      <Canvas
        camera={{ position: [4, 3, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#e2e8f0" />
        <directionalLight position={[-3, 2, -5]} intensity={0.3} color="#06b6d4" />
        <pointLight position={[0, 3, 0]} intensity={0.5} color="#06b6d4" distance={8} />
        
        <MotorBody health={health} />
        <Particles />
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};

export default HeroMachine;
