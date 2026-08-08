import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { CampusPOI } from '../../data/campusData';
import { Building3DModel } from './Building3DModel';
import { PathwayLine3D } from './PathwayLine3D';
import { FirstPersonControls } from './FirstPersonControls';
import { TimeOfDay, RenderPreset } from '../ui/EnvironmentControlsHUD';

interface Campus3DSceneProps {
  locations: CampusPOI[];
  selectedPoi: CampusPOI | null;
  highlightedPoiIds: string[];
  activeCategory: string | null;
  cameraMode: 'orbit' | 'aerial' | 'fps' | 'vr';
  isNightMode: boolean;
  timeOfDay?: TimeOfDay;
  sunAngle?: number;
  renderPreset?: RenderPreset;
  isRainActive?: boolean;
  routePoints: [number, number, number][];
  onSelectPoi: (poi: CampusPOI) => void;
  onExitFPS: () => void;
}

// Camera Interpolator for flying smoothly to selected POIs or Aerial mode
const CameraRig: React.FC<{
  selectedPoi: CampusPOI | null;
  cameraMode: 'orbit' | 'aerial' | 'fps' | 'vr';
  controlsRef: React.RefObject<any>;
}> = ({ selectedPoi, cameraMode, controlsRef }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (cameraMode === 'fps' || cameraMode === 'vr') return;

    if (cameraMode === 'aerial') {
      camera.position.set(0, 110, 20);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    } else if (selectedPoi) {
      const [px, py, pz] = selectedPoi.position;
      const targetPos = new THREE.Vector3(px + 18, py + 16, pz + 24);
      camera.position.set(targetPos.x, targetPos.y, targetPos.z);
      if (controlsRef.current) {
        controlsRef.current.target.set(px, py, pz);
        controlsRef.current.update();
      }
    }
  }, [selectedPoi, cameraMode, camera, controlsRef]);

  return null;
};

// Monsoon Rain Particle System
const MonsoonRainEffect: React.FC = () => {
  const rainRef = useRef<THREE.Points>(null);
  const count = 1200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 160;
      pos[i * 3 + 1] = Math.random() * 80 + 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 160;
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (rainRef.current) {
      const array = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        array[i * 3 + 1] -= 1.8;
        if (array[i * 3 + 1] < 0) {
          array[i * 3 + 1] = 80;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#7dd3fc"
        size={0.4}
        transparent
        opacity={0.7}
      />
    </points>
  );
};

export const Campus3DScene: React.FC<Campus3DSceneProps> = ({
  locations,
  selectedPoi,
  highlightedPoiIds,
  activeCategory,
  cameraMode,
  isNightMode,
  timeOfDay = isNightMode ? 'night' : 'day',
  sunAngle = 45,
  renderPreset = 'realistic',
  isRainActive = false,
  routePoints,
  onSelectPoi,
  onExitFPS,
}) => {
  const controlsRef = useRef<any>(null);

  const filteredLocations = locations.filter((loc) => {
    if (!activeCategory || activeCategory === 'all') return true;
    return loc.category === activeCategory;
  });

  // Calculate sun vector from sun angle
  const rad = (sunAngle * Math.PI) / 180;
  const sunX = Math.cos(rad) * 90;
  const sunY = Math.sin(rad) * 90;
  const sunPos: [number, number, number] = [sunX, sunY, 40];

  const isBlueprint = renderPreset === 'blueprint';
  const isNight = timeOfDay === 'night';
  const isDusk = timeOfDay === 'dusk';

  return (
    <div className="w-full h-full relative bg-slate-950 select-none overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 45, 75], fov: 45, near: 0.1, far: 500 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Environment Sky & Lighting */}
        {isNight ? (
          <>
            <color attach="background" args={['#070a13']} />
            <ambientLight intensity={0.25} />
            <directionalLight
              position={sunPos}
              intensity={0.4}
              color="#93c5fd"
              castShadow
            />
            <Stars radius={120} depth={50} count={3500} factor={4} saturation={0} fade speed={1} />
          </>
        ) : isDusk ? (
          <>
            <color attach="background" args={['#1e1b4b']} />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={sunPos}
              intensity={0.9}
              color="#fb923c"
              castShadow
            />
            <Sky sunPosition={[sunX, 10, 40]} inclination={0.6} azimuth={0.25} />
          </>
        ) : (
          <>
            <color attach="background" args={['#0f172a']} />
            <ambientLight intensity={0.75} />
            <directionalLight
              position={sunPos}
              intensity={1.3}
              color="#fff8e7"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <Sky sunPosition={sunPos} />
          </>
        )}

        {/* Rain Particles */}
        {isRainActive && <MonsoonRainEffect />}

        {/* Camera interpolation rig */}
        <CameraRig selectedPoi={selectedPoi} cameraMode={cameraMode} controlsRef={controlsRef} />

        {/* Orbit Controls */}
        {(cameraMode === 'orbit' || cameraMode === 'aerial') && (
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={cameraMode === 'aerial' ? Math.PI / 4 : Math.PI / 2.05}
            minDistance={10}
            maxDistance={180}
            target={[0, 0, 0]}
          />
        )}

        {/* First-Person Mode Controls */}
        <FirstPersonControls active={cameraMode === 'fps'} onExitFPS={onExitFPS} />

        {/* Campus Ground & Road Infrastructure */}
        <group position={[0, 0, 0]}>
          {/* Main Lawn Base */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[180, 180]} />
            <meshStandardMaterial
              color={isBlueprint ? '#0284c7' : isNight ? '#0f172a' : '#1e293b'}
              roughness={0.8}
              wireframe={isBlueprint}
            />
          </mesh>

          {/* Central Plaza Grid */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <planeGeometry args={[120, 120]} />
            <meshStandardMaterial
              color={isBlueprint ? '#0369a1' : isNight ? '#1e293b' : '#334155'}
              roughness={0.5}
              wireframe={isBlueprint}
            />
          </mesh>

          {/* Main Avenue Roads */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 10]}>
            <planeGeometry args={[16, 120]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -15]}>
            <planeGeometry args={[110, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>

          {/* Decorative Campus Trees */}
          {[-35, -15, 15, 35].map((x, idx) => (
            <group key={`tree_${idx}`} position={[x, 0, 25]}>
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.3, 0.5, 3]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
              <mesh position={[0, 4, 0]}>
                <coneGeometry args={[2.2, 4.5, 8]} />
                <meshStandardMaterial color={isNight ? '#065f46' : '#10b981'} roughness={0.4} />
              </mesh>
            </group>
          ))}

          {/* Contact Shadows */}
          <ContactShadows position={[0, 0.08, 0]} opacity={0.6} scale={140} blur={2} far={10} />
        </group>

        {/* 3D Buildings & Facilities */}
        {filteredLocations.map((poi) => (
          <Building3DModel
            key={poi.id}
            poi={poi}
            isSelected={selectedPoi?.id === poi.id}
            isHighlighted={highlightedPoiIds.includes(poi.id)}
            onClick={onSelectPoi}
            isWireframe={isBlueprint}
          />
        ))}

        {/* Glowing 3D Route Path */}
        {routePoints.length > 0 && <PathwayLine3D points={routePoints} />}
      </Canvas>
    </div>
  );
};
