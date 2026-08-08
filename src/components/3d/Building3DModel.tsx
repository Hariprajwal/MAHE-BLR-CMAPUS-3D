import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
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
  const [px, , pz] = poi.position;
  const [w, h, d] = poi.size;

  const buildingAgent = getBuildingAgent(poi.id);

  useFrame((state) => {
    if (groupRef.current) {
      if (isSelected || isHighlighted) {
        const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.03 + 1.02;
        groupRef.current.scale.setScalar(pulse);
      } else {
        const current = groupRef.current.scale.x;
        if (Math.abs(current - 1) > 0.001) {
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
  const isGate3 = poi.id === 'GATE_3';
  const isParking = poi.category === 'parking';
  const isLibrary = poi.category === 'library';
  const isFacility = poi.category === 'facility';

  // ── PBR Material configs per building type ──
  const concretePBR = {
    roughness: 0.88,
    metalness: 0.04,
  };

  const glassPBR = {
    roughness: 0.02,
    metalness: 0.1,
    // transmission handled via MeshPhysicalMaterial-like opacity
  };

  const steelPBR = {
    roughness: 0.18,
    metalness: 0.82,
  };

  // Derived wall color
  const buildingColor = isSelected
    ? new THREE.Color(poi.color).lerp(new THREE.Color('#38bdf8'), 0.4).getStyle()
    : hovered
    ? new THREE.Color(poi.color).lerp(new THREE.Color('#60a5fa'), 0.3).getStyle()
    : poi.color;

  return (
    <group
      ref={groupRef}
      position={[px, 0, pz]}
      onClick={(e) => { e.stopPropagation(); onClick(poi); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >

      {/* ── Main Building Body — PBR Concrete Material ── */}
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        {isWireframe ? (
          <meshBasicMaterial color={poi.color} wireframe />
        ) : (
          <meshStandardMaterial
            color={buildingColor}
            roughness={isSrishti ? 0.72 : concretePBR.roughness}
            metalness={isAcademic ? 0.08 : isFacility ? 0.05 : concretePBR.metalness}
            envMapIntensity={1.2}
          />
        )}
      </mesh>

      {/* ── Academic: Multi-Wing Structure + PBR Materials ── */}
      {isAcademic && !isWireframe && (
        <group>
          {/* East Wing */}
          <mesh castShadow position={[w / 2 + 2.8, h * 0.4, 0]}>
            <boxGeometry args={[5.5, h * 0.8, d * 0.68]} />
            <meshStandardMaterial
              color={poi.accentColor}
              roughness={concretePBR.roughness}
              metalness={concretePBR.metalness}
              envMapIntensity={1.0}
            />
          </mesh>
          {/* West Wing */}
          <mesh castShadow position={[-w / 2 - 2.8, h * 0.4, 0]}>
            <boxGeometry args={[5.5, h * 0.8, d * 0.68]} />
            <meshStandardMaterial
              color={poi.accentColor}
              roughness={concretePBR.roughness}
              metalness={concretePBR.metalness}
              envMapIntensity={1.0}
            />
          </mesh>
          {/* Steel Connecting Bridge */}
          <mesh castShadow position={[0, h * 0.75, 0]}>
            <boxGeometry args={[w, h * 0.1, d * 0.3]} />
            <meshStandardMaterial
              color="#94a3b8"
              roughness={steelPBR.roughness}
              metalness={steelPBR.metalness}
              envMapIntensity={2.5}
            />
          </mesh>
          {/* PBR Solar Panels: high metalness, low roughness */}
          <mesh position={[0, h + 0.45, 0]} rotation={[-Math.PI / 10, 0, 0]}>
            <boxGeometry args={[w * 0.62, 0.25, d * 0.42]} />
            <meshStandardMaterial
              color="#1e3a8a"
              roughness={0.08}
              metalness={0.92}
              emissive="#0f2472"
              emissiveIntensity={0.15}
              envMapIntensity={3.0}
            />
          </mesh>
          {/* Rooftop HVAC — Steel PBR */}
          <mesh position={[w * 0.25, h + 0.75, -d * 0.22]}>
            <boxGeometry args={[2.8, 1.1, 2.8]} />
            <meshStandardMaterial
              color="#94a3b8"
              roughness={steelPBR.roughness}
              metalness={steelPBR.metalness}
            />
          </mesh>
          {/* HVAC fan */}
          <mesh position={[w * 0.25, h + 1.35, -d * 0.22]}>
            <cylinderGeometry args={[1.0, 1.0, 0.2, 12]} />
            <meshStandardMaterial color="#64748b" roughness={0.25} metalness={0.75} />
          </mesh>
          {/* Rooftop Water Tank */}
          <mesh position={[-w * 0.3, h + 1.0, d * 0.25]}>
            <cylinderGeometry args={[1.0, 1.0, 2.0, 12]} />
            <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      )}

      {/* ── Library: Grand Atrium Facade ── */}
      {isLibrary && !isWireframe && (
        <group>
          {/* Atrium Glass Dome */}
          <mesh position={[0, h + 2, 0]}>
            <sphereGeometry args={[w * 0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#bae6fd"
              roughness={glassPBR.roughness}
              metalness={glassPBR.metalness}
              transparent
              opacity={0.55}
              envMapIntensity={4.0}
            />
          </mesh>
          {/* Steel Dome Ring */}
          <mesh position={[0, h + 0.1, 0]}>
            <torusGeometry args={[w * 0.35, 0.4, 8, 24]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.12} metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* ── Gate 1: Security Tower & Transport Canopy ── */}
      {isGate1 && !isWireframe && (
        <group>
          <mesh position={[0, h + 0.9, 0]}>
            <boxGeometry args={[w + 2.5, 1.5, d + 2.5]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.18}
              metalness={steelPBR.metalness}
              envMapIntensity={2.0}
            />
          </mesh>
          <mesh position={[-w / 2 + 2, h + 3, 0]}>
            <cylinderGeometry args={[1.4, 1.7, 4, 8]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={glassPBR.roughness}
              metalness={0.2}
              transparent
              opacity={0.85}
              envMapIntensity={3.0}
            />
          </mesh>
        </group>
      )}

      {/* ── Gate 3: Parcel Pickup Kiosk ── */}
      {isGate3 && !isWireframe && (
        <group>
          <mesh position={[0, 2, -d / 2 - 2]}>
            <boxGeometry args={[w * 0.8, 3.5, 4]} />
            <meshStandardMaterial color="#16a34a" roughness={0.5} metalness={0.15} />
          </mesh>
        </group>
      )}

      {/* ── Roof Parapet Trim (Concrete cap) ── */}
      {!isParking && !isSports && !isEntrance && !isWireframe && (
        <mesh castShadow position={[0, h + 0.32, 0]}>
          <boxGeometry args={[w + 0.9, 0.65, d + 0.9]} />
          <meshStandardMaterial
            color={poi.accentColor}
            roughness={0.22}
            metalness={0.28}
            envMapIntensity={1.5}
          />
        </mesh>
      )}

      {/* ── Srishti Stepped Terrace ── */}
      {isSrishti && !isWireframe && (
        <group>
          <mesh castShadow position={[0, h + 1.5, 0]}>
            <boxGeometry args={[w * 0.7, 3, d * 0.7]} />
            <meshStandardMaterial color={poi.accentColor} roughness={0.68} metalness={0.05} />
          </mesh>
          {/* Rooftop Garden Surface — dark green earthy */}
          <mesh position={[0, h + 3.2, 0]}>
            <boxGeometry args={[w * 0.62, 0.28, d * 0.62]} />
            <meshStandardMaterial color="#14532d" roughness={0.92} metalness={0.02} />
          </mesh>
        </group>
      )}

      {/* ── Glass Curtain Wall Facade — PBR Glass Transmission ── */}
      {h >= 8 && !isWireframe && (
        <group>
          {/* Front curtain glass */}
          <mesh position={[0, h / 2, d / 2 + 0.07]}>
            <planeGeometry args={[w * 0.86, h * 0.76]} />
            <meshStandardMaterial
              color={isSelected || hovered ? '#bae6fd' : '#7dd3fc'}
              emissive={isSelected ? '#0284c7' : hovered ? '#0369a1' : '#0c4a6e'}
              emissiveIntensity={isSelected ? 0.55 : hovered ? 0.35 : 0.18}
              roughness={glassPBR.roughness}
              metalness={glassPBR.metalness}
              transparent
              opacity={0.78}
              envMapIntensity={4.5}
            />
          </mesh>
          {/* Window mullion grid — dark steel frames */}
          {[...Array(Math.floor(h / 4))].map((_, i) => (
            <mesh key={`mullion_h_${i}`} position={[0, (i + 1) * 4, d / 2 + 0.09]}>
              <planeGeometry args={[w * 0.86, 0.12]} />
              <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.9} />
            </mesh>
          ))}
          {/* Side curtain glass */}
          <mesh position={[0, h / 2, -(d / 2 + 0.07)]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[w * 0.86, h * 0.76]} />
            <meshStandardMaterial
              color="#7dd3fc"
              emissive="#0c4a6e"
              emissiveIntensity={0.15}
              roughness={glassPBR.roughness}
              metalness={glassPBR.metalness}
              transparent
              opacity={0.62}
              envMapIntensity={4.0}
            />
          </mesh>
        </group>
      )}

      {/* ── Selection Wireframe Outline ── */}
      {(isSelected || isHighlighted || hovered) && !isWireframe && (
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[w + 0.8, h + 0.8, d + 0.8]} />
          <meshBasicMaterial
            color={isSelected ? '#38bdf8' : isHighlighted ? '#fbbf24' : '#e2e8f0'}
            wireframe
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {/* ── Sleek 3D Marker Pin Label ── */}
      <Html
        position={[0, h + (isSrishti ? 6 : isEntrance ? 5 : 4.2), 0]}
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
          <span className="text-sm leading-none">{getCategoryIcon(poi.category, poi.id)}</span>
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
