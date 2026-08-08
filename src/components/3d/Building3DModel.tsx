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

function getCategoryIcon(cat: string): string {
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
    case 'exact_verified': return '✓ GPS Verified';
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
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [px, py, pz] = poi.position;
  const [w, h, d] = poi.size;

  // Pulse / scale animation for selected or highlighted buildings
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
  });

  const isSrishti = poi.category === 'srishti_house';
  const isSports = poi.category === 'sports';
  const isEntrance = poi.category === 'entrance';
  const isParking = poi.category === 'parking';
  const isOffCampus = poi.gpsAccuracy === 'off_campus';

  // Base building material color
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
        />
      </mesh>

      {/* ── Roof Architectural Trim ── */}
      {!isParking && !isSports && (
        <mesh castShadow position={[0, h + 0.35, 0]}>
          <boxGeometry args={[w + 0.8, 0.7, d + 0.8]} />
          <meshStandardMaterial color={poi.accentColor} roughness={0.2} metalness={0.3} />
        </mesh>
      )}

      {/* ── Srishti House: Stepped Terrace Profile ── */}
      {isSrishti && (
        <>
          {/* Upper stepped terrace (smaller box on top) */}
          <mesh castShadow position={[0, h + 1.5, 0]}>
            <boxGeometry args={[w * 0.7, 3, d * 0.7]} />
            <meshStandardMaterial color={poi.accentColor} roughness={0.4} />
          </mesh>
          {/* Terrace garden platform */}
          <mesh position={[0, h + 3.2, 0]}>
            <boxGeometry args={[w * 0.6, 0.3, d * 0.6]} />
            <meshStandardMaterial color="#16a34a" roughness={0.8} />
          </mesh>
        </>
      )}

      {/* ── Window Grid — Front Face ── */}
      {h >= 8 && (
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

      {/* ── Window Grid — Back Face ── */}
      {h >= 8 && (
        <mesh position={[0, h / 2, -(d / 2 + 0.06)]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[w * 0.85, h * 0.75]} />
          <meshStandardMaterial
            color="#93c5fd"
            emissive="#1e40af"
            emissiveIntensity={0.15}
            roughness={0.05}
            transparent
            opacity={0.55}
          />
        </mesh>
      )}

      {/* ── Sports Field: Green Turf Ground Plane ── */}
      {isSports && h < 4 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
          <planeGeometry args={[w - 1, d - 1]} />
          <meshStandardMaterial color="#22c55e" roughness={0.9} />
        </mesh>
      )}

      {/* ── Entrance Gate: Arch-like pillars ── */}
      {isEntrance && (
        <>
          <mesh position={[-w / 2 + 2, h / 2, 0]}>
            <cylinderGeometry args={[0.8, 0.8, h, 8]} />
            <meshStandardMaterial color={poi.accentColor} metalness={0.3} />
          </mesh>
          <mesh position={[w / 2 - 2, h / 2, 0]}>
            <cylinderGeometry args={[0.8, 0.8, h, 8]} />
            <meshStandardMaterial color={poi.accentColor} metalness={0.3} />
          </mesh>
        </>
      )}

      {/* ── Selection / Highlight Wireframe Outline ── */}
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

      {/* ── Off-Campus Diagonal Stripe Indicator ── */}
      {isOffCampus && (
        <mesh position={[0, h / 2, d / 2 + 0.1]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#94a3b8" wireframe transparent opacity={0.3} />
        </mesh>
      )}

      {/* ── Floating HTML Label ── */}
      <Html
        position={[0, h + (isSrishti ? 5.5 : 3.5), 0]}
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
          {/* Building name row */}
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">{getCategoryIcon(poi.category)}</span>
            <div>
              <span className="font-bold tracking-wide block">{poi.shortName}</span>
              {poi.rating && (
                <span className="text-[10px] text-amber-300 flex items-center gap-0.5 font-semibold">
                  ⭐ {poi.rating}
                  <span className="text-slate-400 font-normal">({poi.reviewCount})</span>
                </span>
              )}
            </div>
          </div>

          {/* GPS accuracy badge */}
          <div
            className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md self-start"
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
