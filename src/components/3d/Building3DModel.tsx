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

function getGPSBadgeColor(accuracy: string): string {
  switch (accuracy) {
    case 'exact_verified': return '#22c55e';
    case 'zone_approximate': return '#f59e0b';
    case 'off_campus': return '#94a3b8';
    default: return '#94a3b8';
  }
}

function getGPSBadgeLabel(accuracy: string): string {
  switch (accuracy) {
    case 'exact_verified': return '✓ GPS Exact';
    case 'zone_approximate': return '⬦ Zone Approx.';
    case 'off_campus': return '◌ Off-Campus';
    default: return '';
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

  // Pulse animation for selected buildings & gate beacons
  useFrame((state) => {
    if (groupRef.current) {
      if (isSelected || isHighlighted) {
        const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.04 + 1.03;
        groupRef.current.scale.setScalar(pulse);
      } else {
        const current = groupRef.current.scale.x;
        if (current !== 1) {
          groupRef.current.scale.setScalar(THREE.MathUtils.lerp(current, 1, 0.08));
        }
      }
    }

    if (beaconRef.current) {
      beaconRef.current.position.y = h + 2 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }
  });

  const isSrishti = poi.category === 'srishti_house';
  const isSports = poi.category === 'sports';
  const isEntrance = poi.category === 'entrance';
  const isGate1 = poi.id === 'GATE_1';
  const isGate2 = poi.id === 'GATE_2';
  const isGate3 = poi.id === 'GATE_3';
  const isParking = poi.category === 'parking';
  const isOffCampus = poi.gpsAccuracy === 'off_campus';

  const baseColor = hovered ? '#60a5fa' : isSelected ? '#38bdf8' : poi.color;

  return (
    <group
      ref={groupRef}
      position={[px, 0, pz]}
      onClick={(e) => { e.stopPropagation(); onClick(poi); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      {/* ── Main Building Body ── */}
      <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={isSrishti ? 0.5 : 0.25}
          metalness={isSports ? 0.1 : 0.15}
          wireframe={isWireframe}
        />
      </mesh>

      {/* ── Gate 1 Custom Geometry: Transport Office Canopy + Security Tower ── */}
      {isGate1 && !isWireframe && (
        <group>
          {/* 1st Floor Transport Office Canopy */}
          <mesh position={[0, h + 1, 0]}>
            <boxGeometry args={[w + 2, 1.8, d + 2]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.4} />
          </mesh>
          {/* Security Guard Tower */}
          <mesh position={[-w / 2 + 2, h + 3, 0]}>
            <cylinderGeometry args={[1.5, 1.8, 4, 8]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} />
          </mesh>
          {/* RFID Boom Barrier Pole */}
          <mesh position={[0, 1.5, d / 2 + 2]} rotation={[0, 0, Math.PI / 12]}>
            <boxGeometry args={[w - 4, 0.4, 0.4]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
      )}

      {/* ── Gate 3 Custom Geometry: Parcel Counter Kiosk ── */}
      {isGate3 && !isWireframe && (
        <group>
          {/* Backside Parcel Counter Structure */}
          <mesh position={[0, 2, -d / 2 - 2]}>
            <boxGeometry args={[w * 0.8, 3.5, 4]} />
            <meshStandardMaterial color="#16a34a" roughness={0.3} />
          </mesh>
          {/* Parcel Kiosk Roof Canopy */}
          <mesh position={[0, 4, -d / 2 - 2]}>
            <boxGeometry args={[w * 0.9, 0.5, 5]} />
            <meshStandardMaterial color="#4ade80" metalness={0.3} />
          </mesh>
        </group>
      )}

      {/* ── Gate 2 Custom Geometry: Service Check Barrier ── */}
      {isGate2 && !isWireframe && (
        <group>
          <mesh position={[0, 1, d / 2 + 1]}>
            <boxGeometry args={[w + 1, 0.5, 0.5]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      )}

      {/* ── Roof Architectural Trim ── */}
      {!isParking && !isSports && !isEntrance && !isWireframe && (
        <mesh castShadow position={[0, h + 0.35, 0]}>
          <boxGeometry args={[w + 0.8, 0.7, d + 0.8]} />
          <meshStandardMaterial color={poi.accentColor} roughness={0.2} metalness={0.3} />
        </mesh>
      )}

      {/* ── Srishti House: Stepped Terrace Profile ── */}
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

      {/* ── Window Grid — Front Face ── */}
      {h >= 8 && !isWireframe && (
        <mesh position={[0, h / 2, d / 2 + 0.06]}>
          <planeGeometry args={[w * 0.85, h * 0.75]} />
          <meshStandardMaterial
            color={isSelected || hovered ? '#bae6fd' : '#93c5fd'}
            emissive={isSelected ? '#0369a1' : '#1e40af'}
            emissiveIntensity={isSelected || hovered ? 0.6 : 0.2}
            roughness={0.05}
            transparent
            opacity={0.75}
          />
        </mesh>
      )}

      {/* ── Beacon Light for Gates ── */}
      {isEntrance && (
        <mesh ref={beaconRef} position={[0, h + 2, 0]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial
            color={isGate1 ? '#38bdf8' : isGate3 ? '#4ade80' : '#f59e0b'}
          />
        </mesh>
      )}

      {/* ── Selection Wireframe Outline ── */}
      {(isSelected || isHighlighted || hovered) && (
        <mesh position={[0, h / 2, 0]}>
          <boxGeometry args={[w + 0.8, h + 0.8, d + 0.8]} />
          <meshBasicMaterial
            color={isSelected ? '#38bdf8' : isHighlighted ? '#fbbf24' : '#e2e8f0'}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {/* ── Off-Campus Indicator ── */}
      {isOffCampus && (
        <mesh position={[0, h / 2, d / 2 + 0.1]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#94a3b8" wireframe transparent opacity={0.3} />
        </mesh>
      )}

      {/* ── Floating Label ── */}
      <Html
        position={[0, h + (isSrishti ? 5.5 : isEntrance ? 4.5 : 3.5), 0]}
        center
        distanceFactor={55}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={(e) => { e.stopPropagation(); onClick(poi); }}
          className={`
            px-2.5 py-1.5 rounded-xl shadow-2xl backdrop-blur-md border
            transition-all duration-200 flex flex-col gap-0.5 cursor-pointer
            select-none text-xs font-semibold whitespace-nowrap
            ${isSelected
              ? 'bg-sky-600/95 text-white border-sky-400 ring-4 ring-sky-500/50 scale-110'
              : isHighlighted
              ? 'bg-amber-500/95 text-white border-amber-300 ring-4 ring-amber-400/50 scale-105'
              : hovered
              ? 'bg-slate-900/95 text-sky-300 border-sky-500 scale-105'
              : 'bg-slate-900/85 text-slate-100 border-slate-700/60'
            }
          `}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">{getCategoryIcon(poi.category, poi.id)}</span>
            <div>
              <span className="font-bold tracking-wide block">{poi.shortName}</span>
              {isGate1 && <span className="text-[9px] text-sky-300 block font-normal">Transport Office Hub</span>}
              {isGate3 && <span className="text-[9px] text-emerald-300 block font-normal">Parcel Pickup (8AM-10PM)</span>}
            </div>
          </div>

          <div
            className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md self-start mt-0.5"
            style={{
              backgroundColor: getGPSBadgeColor(poi.gpsAccuracy) + '30',
              color: getGPSBadgeColor(poi.gpsAccuracy),
              border: `1px solid ${getGPSBadgeColor(poi.gpsAccuracy)}55`,
            }}
          >
            {getGPSBadgeLabel(poi.gpsAccuracy)}
          </div>
        </div>
      </Html>
    </group>
  );
};
