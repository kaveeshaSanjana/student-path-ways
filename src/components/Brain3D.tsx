import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Neuron component with pulsing animation
const Neuron = ({ position, color = "#3b82f6" }: { position: [number, number, number], color?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.2);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
};

// Neural connection line
const NeuralConnection = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
  const lineRef = useRef<THREE.Line>(null);
  
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array([
      start[0], start[1], start[2],
      end[0], end[1], end[2]
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [start, end]);

  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime;
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = (Math.sin(time * 3) + 1) * 0.3 + 0.3;
    }
  });

  return (
    <primitive 
      object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
        color: "#60a5fa", 
        transparent: true, 
        opacity: 0.6 
      }))} 
      ref={lineRef}
    />
  );
};

// Main brain structure
const BrainStructure = () => {
  const brainRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Generate neuron positions in brain-like clusters
  const neurons = useMemo(() => {
    const positions: [number, number, number][] = [];
    
    // Create multiple clusters representing different brain regions
    const clusters = [
      { center: [0.5, 0.3, 0], count: 15 },
      { center: [-0.5, 0.3, 0], count: 15 },
      { center: [0, -0.2, 0.3], count: 12 },
      { center: [0, -0.2, -0.3], count: 12 },
    ];

    clusters.forEach(cluster => {
      for (let i = 0; i < cluster.count; i++) {
        const angle = (i / cluster.count) * Math.PI * 2;
        const radius = Math.random() * 0.4 + 0.2;
        const x = cluster.center[0] + Math.cos(angle) * radius + (Math.random() - 0.5) * 0.3;
        const y = cluster.center[1] + Math.sin(angle) * radius + (Math.random() - 0.5) * 0.3;
        const z = cluster.center[2] + (Math.random() - 0.5) * 0.4;
        positions.push([x, y, z]);
      }
    });
    
    return positions;
  }, []);

  // Generate connections between nearby neurons
  const connections = useMemo(() => {
    const conns: { start: [number, number, number], end: [number, number, number] }[] = [];
    
    for (let i = 0; i < neurons.length; i++) {
      for (let j = i + 1; j < neurons.length; j++) {
        const distance = new THREE.Vector3(...neurons[i]).distanceTo(new THREE.Vector3(...neurons[j]));
        if (distance < 0.6 && Math.random() > 0.7) {
          conns.push({ start: neurons[i], end: neurons[j] });
        }
      }
    }
    
    return conns;
  }, [neurons]);

  return (
    <group ref={brainRef}>
      {/* Main brain shape */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#1e40af" 
          transparent 
          opacity={0.1} 
          wireframe={false}
        />
      </mesh>
      
      {/* Brain outline wireframe */}
      <mesh>
        <sphereGeometry args={[1.02, 16, 16]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.3} 
          wireframe={true}
        />
      </mesh>
      
      {/* Neurons */}
      {neurons.map((position, index) => (
        <Neuron 
          key={index} 
          position={position} 
          color={index % 3 === 0 ? "#60a5fa" : "#3b82f6"} 
        />
      ))}
      
      {/* Neural connections */}
      {connections.map((connection, index) => (
        <NeuralConnection 
          key={index} 
          start={connection.start} 
          end={connection.end} 
        />
      ))}
    </group>
  );
};

// Floating particles for neural activity
const NeuralParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] = Math.sin(state.clock.elapsedTime + i) * 0.5;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#60a5fa" size={0.02} transparent opacity={0.6} />
    </points>
  );
};

export const Brain3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [2, 0, 2], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60a5fa" />
        
        <BrainStructure />
        <NeuralParticles />
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={5}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
};