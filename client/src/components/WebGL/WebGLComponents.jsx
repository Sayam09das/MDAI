import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Animated particles component
const Particles = ({ count = 5000 }) => {
  const ref = useRef();
  
  // Generate random particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.rotation.y = state.clock.elapsedTime * 0.07;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Floating geometric shapes
const FloatingShapes = () => {
  const shapes = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5
      ],
      scale: Math.random() * 0.3 + 0.1,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      color: ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 0.5 + 0.2
    }));
  }, []);

  return (
    <>
      {shapes.map((shape, i) => (
        <Float key={i} speed={shape.speed} rotationIntensity={1} floatIntensity={2}>
          <mesh position={shape.position} scale={shape.scale} rotation={shape.rotation}>
            {i % 3 === 0 ? (
              <icosahedronGeometry args={[1, 0]} />
            ) : i % 3 === 1 ? (
              <octahedronGeometry args={[1, 0]} />
            ) : (
              <dodecahedronGeometry args={[1, 0]} />
            )}
            <meshStandardMaterial 
              color={shape.color} 
              transparent 
              opacity={0.6}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

// Neural network nodes
const NeuralNetwork = () => {
  const nodes = useMemo(() => {
    const nodePositions = [];
    for (let i = 0; i < 30; i++) {
      nodePositions.push({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8 - 3
        ],
        scale: Math.random() * 0.15 + 0.05
      });
    }
    return nodePositions;
  }, []);

  const lines = useMemo(() => {
    const linePositions = [];
    for (let i = 0; i < 50; i++) {
      const start = nodes[Math.floor(Math.random() * nodes.length)];
      const end = nodes[Math.floor(Math.random() * nodes.length)];
      if (start && end) {
        linePositions.push([start.position, end.position]);
      }
    }
    return linePositions;
  }, [nodes]);

  return (
    <>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position} scale={node.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial 
            color="#6366f1" 
            emissive="#6366f1"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line[0], ...line[1]])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
        </line>
      ))}
    </>
  );
};

// Main WebGL Scene
const WebGLScene = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
      
      {/* Particles */}
      <Particles count={3000} />
      
      {/* Floating Shapes */}
      <FloatingShapes />
      
      {/* Neural Network */}
      <NeuralNetwork />
      
      {/* Stars background */}
      <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />
    </>
  );
};

// Interactive 3D Background Component
const WebGLBackground = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <WebGLScene />
      </Canvas>
    </div>
  );
};

// 3D Card Hover Effect Component
const WebGL3DCard = ({ children, className = "" }) => {
  const cardRef = useRef();
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };
  
  return (
    <div
      ref={cardRef}
      className={`transition-all duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {children}
    </div>
  );
};

// Holographic Button Effect
const HoloButton = ({ children, className = "" }) => {
  return (
    <button
      className={`relative overflow-hidden group ${className}`}
      style={{
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1)',
        backgroundSize: '300% 100%',
        animation: 'holoGradient 3s ease infinite',
      }}
    >
      <style>{`
        @keyframes holoGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="relative z-10 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg group-hover:bg-white transition-colors">
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    </button>
  );
};

export { WebGLBackground, WebGL3DCard, HoloButton, WebGLScene };
export default WebGLBackground;

