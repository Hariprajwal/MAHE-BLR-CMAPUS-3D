import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CampusPOI } from '../../data/campusData';
import { getBuildingAgent } from '../../data/buildingAgentEngine';

interface Building3DModelProps {
  poi: CampusPOI;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: (poi: CampusPOI) => void;
  isWireframe?: boolean;
}

function getCategoryIcon(cat: string, id: string): string {
  if (id === 'GATE_1') return '🚌';
  if (id === 'GATE_2') return '🚛';
  if (id === 'GATE_3') return '📦';
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
    case 'srishti_house': return '🎨';
    default: return '📍';
  }
}

export const Building3DModel: React.FC<Building3DModelProps> = ({
  poi,
  isSelected,
  isHighlighted,
  onClick,
  isWireframe = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [px, py, pz] = poi.position;
  const [w, h, d] = poi.size;

  const buildingAgent = getBuildingAgent(poi.id);

  // Smooth floating animation for selection & gate beacon
  useFrame((state) => {
    if (groupRef.current) {
      if (isSelected || isHighlighted) {
        const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.03 + 1.02;
        groupRef.current.scale.setScalar(pulse);
      } else {
        const current = groupRef.current.scale.x;
        if (current !== 1) {
          groupRef.current.scale.setScalar(THREE.MathUtils.lerp(current, 1, 0.08));
        }
      }
    }

    if (beaconRef.current) {
      beaconRef.current.position.y = h + 2 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
    }
  });

  const isSrishti = poi.category === 'srishti_house';
  const isAcademic = poi.category === 'academic';
  const isSports = poi.category === 'sports';
  const isEntrance = poi.category === 'entrance';
  const isGate1 = poi.id === 'GATE_1';
  const isGate2 = poi.id === 'GATE_2';
  const isGate3 = poi.id === 'GATE_3';
  const isParking = poi.category === 'parking';

  const baseColor = hovered ? '#60a5fa' : isSelected ? '#38bdf8' : poi.color;

  return (
    <group
      ref={groupRef}
      position={[px, 0, pz]}
      onClick={(e) => { e.stopPropagation(); onClick(poi); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      {/* ── Main Architectural Building Body ── */}
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={isSrishti ? 0.6 : 0.3}
          metalness={isAcademic ? 0.25 : 0.15}
          wireframe={isWireframe}
        />
      </mesh>

      {/* ── Academic Multi-Wing Structure (Side Wing Additions) ── */}
      {isAcademic && !isWireframe && (
        <group>
          {/* East Wing Extension */}
          <mesh castShadow position={[w / 2 + 3, h * 0.4, 0]}>
            <boxGeometry args={[6, h * 0.8, d * 0.7]} />
            <meshStandardMaterial color={poi.accentColor} roughness={0.3} metalness={0.2} />
          </mesh>
          {/* West Wing Extension */}
          <mesh castShadow position={[-w / 2 - 3, h * 0.4, 0]}>
            <boxGeometry args={[6, h * 0.8, d * 0.7]} />
            <meshStandardMaterial color={poi.accentColor} roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Rooftop Solar Panels */}
          <mesh position={[0, h + 0.5, 0]} rotation={[-Math.PI / 12, 0, 0]}>
            <boxGeometry args={[w * 0.6, 0.3, d * 0.4]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.1} metalness={0.8} />
          </mesh>
          {/* Rooftop HVAC Units */}
          <mesh position={[w * 0.25, h + 0.8, -d * 0.2]}>
            <boxGeometry args={[3, 1.2, 3]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
        </group>
      )}

      {/* ── Gate 1 Custom Geometry: Security Tower & Transport Canopy ── */}
      {isGate1 && !isWireframe && (
        <group>
          <mesh position={[0, h + 1, 0]}>
            <boxGeometry args={[w + 2, 1.8, d + 2]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.4} />
          </mesh>
          <mesh position={[-w / 2 + 2, h + 3, 0]}>
            <cylinderGeometry args={[1.5, 1.8, 4, 8]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* ── Gate 3 Custom Geometry: Parcel Pickup Kiosk ── */}
      {isGate3 && !isWireframe && (
        <group>
          <mesh position={[0, 2, -d / 2 - 2]}>
            <boxGeometry args={[w * 0.8, 3.5, 4]} />
            <meshStandardMaterial color="#16a34a" roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* ── Roof Parapet Trim ── */}
      {!isParking && !isSports && !isEntrance && !isWireframe && (
        <mesh castShadow position={[0, h + 0.35, 0]}>
          <boxGeometry args={[w + 0.8, 0.7, d + 0.8]} />
          <meshStandardMaterial color={poi.accentColor} roughness={0.2} metalness={0.3} />
        </mesh>
      )}

      {/* ── Srishti Stepped Terrace Profile ── */}
      {isSrishti && !isWireframe && (
        <group>
          <mesh castShadow position={[0, h + 1.5, 0]}>
            <boxGeometry args={[w * 0.7, 3, d * 0.7]} />
            <meshStandardMaterial color={poi.accentColor} roughness={0.4} />
          </mesh>
          <mesh position={[0, h + 3.2, 0]}>
            <boxGeometry args={[w * 0.6, 0.3, d * 0.6]} />
            <meshStandardMaterial color="#16a34a" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* ── Glass Curtain Wall Facade ── */}
      {h >= 8 && !isWireframe && (
        <group>
          {/* Front Glass */}
          <mesh position={[0, h / 2, d / 2 + 0.08]}>
            <planeGeometry args={[w * 0.88, h * 0.78]} />
            <meshStandardMaterial
              color={isSelected || hovered ? '#bae6fd' : '#7dd3fc'}
              emissive={isSelected ? '#0284c7' : '#0369a1'}
              emissiveIntensity={isSelected || hovered ? 0.6 : 0.25}
              roughness={0.05}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Back Glass */}
          <mesh position={[0, h / 2, -(d / 2 + 0.08)]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[w * 0.88, h * 0.78]} />
            <meshStandardMaterial
              color="#7dd3fc"
              emissive="#0369a1"
              emissiveIntensity={0.2}
              roughness={0.05}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      )}

      {/* ── Selection Wireframe Outline ── */}
      {(isSelected || isHighlighted || hovered) && (
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[w + 1, h + 1, d + 1]} />
          <meshBasicMaterial
            color={isSelected ? '#38bdf8' : isHighlighted ? '#fbbf24' : '#e2e8f0'}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {/* ── Sleek De-Cluttered 3D Marker Pin ── */}
      <Html
        position={[0, h + (isSrishti ? 6 : isEntrance ? 5 : 4), 0]}
        center
        distanceFactor={60}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={(e) => { e.stopPropagation(); onClick(poi); }}
          className={`
            transition-all duration-200 cursor-pointer select-none flex items-center gap-2
            ${isSelected || hovered
              ? 'px-3 py-1.5 rounded-2xl bg-slate-900/95 text-white border-2 border-sky-400 shadow-2xl scale-110 ring-4 ring-sky-500/40'
              : 'px-2 py-1 rounded-xl bg-slate-900/85 text-slate-200 border border-slate-700/80 shadow-lg hover:scale-105'
            }
          `}
        >
          {/* Icon Pin */}
          <span className="text-sm leading-none">{getCategoryIcon(poi.category, poi.id)}</span>

          {/* Label Title (always clean & legible) */}
          <div className="flex flex-col">
            <span className="font-bold text-xs tracking-tight whitespace-nowrap block">{poi.shortName}</span>
            {(isSelected || hovered) && (
              <span className="text-[9px] text-sky-300 font-semibold flex items-center gap-1">
                <span>{buildingAgent.avatarIcon}</span>
                <span>{buildingAgent.agentName}</span>
              </span>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};
