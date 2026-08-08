import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { CampusPOI } from '../../data/campusData';
import { Building3DModel } from './Building3DModel';
import { PathwayLine3D } from './PathwayLine3D';
import { FirstPersonControls } from './FirstPersonControls';

interface Campus3DSceneProps {
  locations: CampusPOI[];
  selectedPoi: CampusPOI | null;
  highlightedPoiIds: string[];
  activeCategory: string | null;
  cameraMode: 'orbit' | 'aerial' | 'fps' | 'vr';
  isNightMode: boolean;
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
      // High-altitude orthographic-like overview
      camera.position.set(0, 110, 20);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    } else if (selectedPoi) {
      // Smooth fly-to towards selected POI
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

export const Campus3DScene: React.FC<Campus3DSceneProps> = ({
  locations,
  selectedPoi,
  highlightedPoiIds,
  activeCategory,
  cameraMode,
  isNightMode,
  routePoints,
  onSelectPoi,
  onExitFPS
}) => {
  const controlsRef = useRef<any>(null);

  // Filter locations based on category
  const filteredLocations = locations.filter((loc) => {
    if (!activeCategory || activeCategory === 'all') return true;
    return loc.category === activeCategory;
  });

  return (
    <div className="w-full h-full relative bg-slate-950 select-none overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 45, 75], fov: 45, near: 0.1, far: 500 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Environment Sky & Lighting */}
        {isNightMode ? (
          <>
            <color attach="background" args={['#070a13']} />
            <ambientLight intensity={0.25} />
            <directionalLight
              position={[20, 60, 20]}
              intensity={0.4}
              color="#93c5fd"
              castShadow
            />
            <Stars radius={120} depth={50} count={3500} factor={4} saturation={0} fade speed={1} />
          </>
        ) : (
          <>
            <color attach="background" args={['#0f172a']} />
            <ambientLight intensity={0.7} />
            <directionalLight
              position={[40, 80, 40]}
              intensity={1.2}
              color="#fff8e7"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <Sky sunPosition={[100, 40, 100]} />
          </>
        )}

        {/* Camera interpolation rig */}
        <CameraRig selectedPoi={selectedPoi} cameraMode={cameraMode} controlsRef={controlsRef} />

        {/* Orbit Controls (Active in Orbit and Aerial Modes) */}
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
          {/* Main Grass Lawn Base */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[180, 180]} />
            <meshStandardMaterial color={isNightMode ? '#0f172a' : '#1e293b'} roughness={0.8} />
          </mesh>

          {/* Central Plaza & Paved Walkway Network Grid */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <planeGeometry args={[120, 120]} />
            <meshStandardMaterial color={isNightMode ? '#1e293b' : '#334155'} roughness={0.5} />
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

          {/* Decorative Campus Trees & Garden Clusters */}
          {[-35, -15, 15, 35].map((x, idx) => (
            <group key={`tree_${idx}`} position={[x, 0, 25]}>
              {/* Trunk */}
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.3, 0.5, 3]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
              {/* Foliage */}
              <mesh position={[0, 4, 0]}>
                <coneGeometry args={[2.2, 4.5, 8]} />
                <meshStandardMaterial color={isNightMode ? '#065f46' : '#10b981'} roughness={0.4} />
              </mesh>
            </group>
          ))}

          {/* Soft Ground Contact Shadows */}
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
          />
        ))}

        {/* Glowing 3D Route Path */}
        {routePoints.length > 0 && <PathwayLine3D points={routePoints} />}
      </Canvas>
    </div>
  );
};
