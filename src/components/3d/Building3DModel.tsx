import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CampusPOI } from '../../data/campusData';

interface Building3DModelProps {
  poi: CampusPOI;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: (poi: CampusPOI) => void;
}

export const Building3DModel: React.FC<Building3DModelProps> = ({
  poi,
  isSelected,
  isHighlighted,
  onClick
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const [w, h, d] = poi.size;
  const [px, py, pz] = poi.position;

  // Pulse animation for selected or search-highlighted building
  useFrame((state) => {
    if (meshRef.current && (isSelected || isHighlighted)) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.15 + 1.05;
      meshRef.current.scale.set(pulse, pulse, pulse);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'academic': return '🏢';
      case 'hostel': return '🏨';
      case 'restaurant': return '🍕';
      case 'cafe': return '☕';
      case 'library': return '📚';
      case 'sports': return '🏟️';
      case 'facility': return '🏛️';
      case 'medical': return '🏥';
      case 'entrance': return '🚪';
      case 'atm': return '🏧';
      case 'parking': return '🅿️';
      default: return '📍';
    }
  };

  return (
    <group
      ref={meshRef}
      position={[px, py, pz]}
      onClick={(e) => {
        e.stopPropagation();
        onClick(poi);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Main Building Structure Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={hovered ? '#60a5fa' : isSelected ? '#3b82f6' : poi.color}
          roughness={0.3}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Roof Architectural Trim */}
      <mesh position={[0, h / 2 + 0.3, 0]}>
        <boxGeometry args={[w * 0.95, 0.6, d * 0.95]} />
        <meshStandardMaterial color={poi.accentColor} roughness={0.2} />
      </mesh>

      {/* Glass Windows Grid Overlay */}
      {h >= 6 && (
        <mesh position={[0, 0, d / 2 + 0.05]}>
          <planeGeometry args={[w * 0.85, h * 0.7]} />
          <meshStandardMaterial
            color="#93c5fd"
            emissive="#1e3a8a"
            emissiveIntensity={hovered || isSelected ? 0.6 : 0.2}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Selection / Highlight Glowing Boundary Frame */}
      {(isSelected || isHighlighted || hovered) && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w + 0.6, h + 0.6, d + 0.6]} />
          <meshBasicMaterial
            color={isSelected ? '#38bdf8' : isHighlighted ? '#f59e0b' : '#ffffff'}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* 3D Floating Html Label & Badge */}
      <Html
        position={[0, h / 2 + 3.5, 0]}
        center
        distanceFactor={60}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick(poi);
          }}
          className={`px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md border transition-all duration-300 flex items-center gap-2 cursor-pointer select-none text-xs font-semibold whitespace-nowrap ${
            isSelected
              ? 'bg-blue-600/90 text-white border-blue-400 ring-4 ring-blue-500/40 scale-110'
              : isHighlighted
              ? 'bg-amber-500/90 text-white border-amber-300 ring-4 ring-amber-400/40 scale-105'
              : hovered
              ? 'bg-slate-900/90 text-sky-300 border-sky-400 scale-105'
              : 'bg-slate-900/80 text-slate-200 border-slate-700/60 hover:bg-slate-900/95'
          }`}
        >
          <span className="text-base">{getCategoryIcon(poi.category)}</span>
          <div className="flex flex-col">
            <span className="font-bold tracking-wide">{poi.shortName}</span>
            {poi.rating && (
              <span className="text-[10px] text-amber-300 flex items-center gap-1 font-medium">
                ⭐ {poi.rating} <span className="text-slate-400">({poi.reviewCount})</span>
              </span>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};
