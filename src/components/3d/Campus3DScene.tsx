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
      camera.position.set(0, 160, 30);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    } else if (selectedPoi) {
      const [px, py, pz] = selectedPoi.position;
      const targetPos = new THREE.Vector3(px + 24, py + 22, pz + 32);
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
  const count = 1600;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 260;
      pos[i * 3 + 1] = Math.random() * 100 + 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 260;
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (rainRef.current) {
      const array = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        array[i * 3 + 1] -= 2.2;
        if (array[i * 3 + 1] < 0) {
          array[i * 3 + 1] = 100;
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
        size={0.45}
        transparent
        opacity={0.75}
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

  const rad = (sunAngle * Math.PI) / 180;
  const sunX = Math.cos(rad) * 120;
  const sunY = Math.sin(rad) * 120;
  const sunPos: [number, number, number] = [sunX, sunY, 60];

  const isBlueprint = renderPreset === 'blueprint';
  const isNight = timeOfDay === 'night';
  const isDusk = timeOfDay === 'dusk';

  return (
    <div className="w-full h-full relative bg-slate-950 select-none overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 65, 110], fov: 45, near: 0.1, far: 600 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Environment Sky & Lighting */}
        {isNight ? (
          <>
            <color attach="background" args={['#050811']} />
            <ambientLight intensity={0.3} />
            <directionalLight
              position={sunPos}
              intensity={0.45}
              color="#93c5fd"
              castShadow
            />
            <Stars radius={160} depth={60} count={4000} factor={4} saturation={0} fade speed={1} />
          </>
        ) : isDusk ? (
          <>
            <color attach="background" args={['#1e1b4b']} />
            <ambientLight intensity={0.55} />
            <directionalLight
              position={sunPos}
              intensity={1.0}
              color="#fb923c"
              castShadow
            />
            <Sky sunPosition={[sunX, 10, 60]} inclination={0.6} azimuth={0.25} />
          </>
        ) : (
          <>
            <color attach="background" args={['#0f172a']} />
            <ambientLight intensity={0.8} />
            <directionalLight
              position={sunPos}
              intensity={1.35}
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

        {/* Camera Rig */}
        <CameraRig selectedPoi={selectedPoi} cameraMode={cameraMode} controlsRef={controlsRef} />

        {/* Orbit Controls */}
        {(cameraMode === 'orbit' || cameraMode === 'aerial') && (
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={cameraMode === 'aerial' ? Math.PI / 4 : Math.PI / 2.05}
            minDistance={15}
            maxDistance={240}
            target={[0, 0, 0]}
          />
        )}

        {/* First-Person Mode Controls */}
        <FirstPersonControls active={cameraMode === 'fps'} onExitFPS={onExitFPS} />

        {/* 85-Acre Ground & Road Infrastructure Grid */}
        <group position={[0, 0, 0]}>
          {/* Main 260m Ground Base Lawn */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[260, 260]} />
            <meshStandardMaterial
              color={isBlueprint ? '#0284c7' : isNight ? '#0b1329' : '#1e293b'}
              roughness={isRainActive ? 0.1 : 0.85}
              metalness={isRainActive ? 0.8 : 0.1}
              wireframe={isBlueprint}
            />
          </mesh>

          {/* Central Paved Pedestrian Plaza Network */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <planeGeometry args={[180, 180]} />
            <meshStandardMaterial
              color={isBlueprint ? '#0369a1' : isNight ? '#1e293b' : '#334155'}
              roughness={0.5}
              wireframe={isBlueprint}
            />
          </mesh>

          {/* North-South Main Entrance Avenue Road */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 25]}>
            <planeGeometry args={[20, 170]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>

          {/* East-West Academic Ring Road */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -35]}>
            <planeGeometry args={[220, 20]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>

          {/* Streetlamps Along Main Avenue */}
          {isNight && [-60, -20, 20, 60].map((z, idx) => (
            <group key={`lamp_${idx}`} position={[12, 0, z]}>
              <mesh position={[0, 4, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 8]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
              <pointLight position={[0, 7.8, 0]} intensity={1.5} color="#fbbf24" distance={25} />
            </group>
          ))}

          {/* Landscaped Tree Groves (Spacious Perimeter Placement) */}
          {[-100, -60, 60, 100].map((x, idx) => (
            <React.Fragment key={`grove_${idx}`}>
              <group position={[x, 0, 80]}>
                <mesh position={[0, 1.8, 0]}>
                  <cylinderGeometry args={[0.4, 0.6, 3.6]} />
                  <meshStandardMaterial color="#78350f" />
                </mesh>
                <mesh position={[0, 5, 0]}>
                  <coneGeometry args={[2.8, 5.5, 8]} />
                  <meshStandardMaterial color={isNight ? '#065f46' : '#10b981'} roughness={0.4} />
                </mesh>
              </group>

              <group position={[x, 0, -80]}>
                <mesh position={[0, 1.8, 0]}>
                  <cylinderGeometry args={[0.4, 0.6, 3.6]} />
                  <meshStandardMaterial color="#78350f" />
                </mesh>
                <mesh position={[0, 5, 0]}>
                  <coneGeometry args={[2.8, 5.5, 8]} />
                  <meshStandardMaterial color={isNight ? '#065f46' : '#10b981'} roughness={0.4} />
                </mesh>
              </group>
            </React.Fragment>
          ))}

          {/* Ground Contact Shadows */}
          <ContactShadows position={[0, 0.08, 0]} opacity={0.65} scale={220} blur={2.5} far={12} />
        </group>

        {/* 3D Buildings & Facilities (Spacious Layout) */}
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
