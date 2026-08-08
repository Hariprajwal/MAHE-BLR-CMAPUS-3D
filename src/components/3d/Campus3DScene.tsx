import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls, Sky, Stars, ContactShadows, Environment,
  BakeShadows, useHelper,
} from '@react-three/drei';
import * as THREE from 'three';
import { CampusPOI } from '../../data/campusData';
import { Building3DModel } from './Building3DModel';
import { PathwayLine3D } from './PathwayLine3D';
import { FirstPersonControls } from './FirstPersonControls';
import { PostProcessingEffects } from './PostProcessingEffects';
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

// ── Camera Interpolator ──
const CameraRig: React.FC<{
  selectedPoi: CampusPOI | null;
  cameraMode: 'orbit' | 'aerial' | 'fps' | 'vr';
  controlsRef: React.RefObject<any>;
}> = ({ selectedPoi, cameraMode, controlsRef }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (cameraMode === 'fps' || cameraMode === 'vr') return;
    if (cameraMode === 'aerial') {
      camera.position.set(0, 165, 30);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    } else if (selectedPoi) {
      const [spx, spy, spz] = selectedPoi.position;
      camera.position.set(spx + 28, spy + 24, spz + 36);
      if (controlsRef.current) {
        controlsRef.current.target.set(spx, spy, spz);
        controlsRef.current.update();
      }
    }
  }, [selectedPoi, cameraMode, camera, controlsRef]);

  return null;
};

// ── Monsoon Rain Particle System ──
const MonsoonRainEffect: React.FC = () => {
  const rainRef = useRef<THREE.Points>(null);
  const count = 1800;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 270;
      pos[i * 3 + 1] = Math.random() * 110 + 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 270;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (rainRef.current) {
      const arr = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] -= 2.4;
        if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = 110;
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#7dd3fc" size={0.42} transparent opacity={0.72} />
    </points>
  );
};

// ── Ground & Infrastructure Layer ──
const GroundLayer: React.FC<{
  isBlueprint: boolean;
  isNight: boolean;
  isRainActive: boolean;
}> = ({ isBlueprint, isNight, isRainActive }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Main 260m Campus Lawn — PBR Grass/Concrete */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <planeGeometry args={[270, 270]} />
        <meshStandardMaterial
          color={isBlueprint ? '#0c4a6e' : isNight ? '#0b1329' : '#1e3a2b'}
          roughness={isRainActive ? 0.12 : 0.88}
          metalness={isRainActive ? 0.6 : 0.02}
          envMapIntensity={isRainActive ? 2.5 : 0.5}
          wireframe={isBlueprint}
        />
      </mesh>

      {/* Central Paved Plaza — light concrete */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[190, 190]} />
        <meshStandardMaterial
          color={isBlueprint ? '#0369a1' : isNight ? '#1e293b' : '#374151'}
          roughness={isRainActive ? 0.08 : 0.55}
          metalness={isRainActive ? 0.4 : 0.05}
          envMapIntensity={isRainActive ? 3.0 : 0.8}
          wireframe={isBlueprint}
        />
      </mesh>

      {/* North–South Main Entrance Avenue — asphalt */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 28]}>
        <planeGeometry args={[22, 175]} />
        <meshStandardMaterial
          color={isNight ? '#0a0f1c' : '#111827'}
          roughness={isRainActive ? 0.08 : 0.7}
          metalness={isRainActive ? 0.5 : 0.05}
          envMapIntensity={isRainActive ? 4.0 : 0.3}
        />
      </mesh>

      {/* White Lane Markings on main avenue */}
      {[-30, -10, 10, 30, 50, 70, 90].map((z, i) => (
        <mesh key={`lane_${i}`} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, z]}>
          <planeGeometry args={[0.5, 5.5]} />
          <meshStandardMaterial color="white" roughness={0.4} />
        </mesh>
      ))}

      {/* East–West Academic Ring Road — asphalt */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -38]}>
        <planeGeometry args={[230, 22]} />
        <meshStandardMaterial
          color={isNight ? '#0a0f1c' : '#111827'}
          roughness={isRainActive ? 0.08 : 0.7}
          metalness={isRainActive ? 0.5 : 0.05}
          envMapIntensity={isRainActive ? 4.0 : 0.3}
        />
      </mesh>

      {/* Night Streetlamps */}
      {isNight && [-65, -25, 15, 55].map((z, idx) => (
        <group key={`lamp_${idx}`} position={[14, 0, z]}>
          <mesh position={[0, 4.5, 0]}>
            <cylinderGeometry args={[0.14, 0.18, 9]} />
            <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Lamp arm */}
          <mesh position={[-1.5, 8.9, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.07, 0.07, 3]} />
            <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.7} />
          </mesh>
          <pointLight position={[-2.5, 9, 0]} intensity={2.5} color="#fbbf24" distance={28} decay={2} />
        </group>
      ))}

      {/* Landscaped Tree Groves */}
      {[-105, -62, 62, 105].map((x, idx) => (
        <React.Fragment key={`grove_${idx}`}>
          {[85, -85].map((z, jdx) => (
            <group key={`tree_${idx}_${jdx}`} position={[x, 0, z]}>
              {/* Trunk */}
              <mesh position={[0, 1.9, 0]} castShadow>
                <cylinderGeometry args={[0.42, 0.6, 3.8]} />
                <meshStandardMaterial color="#78350f" roughness={0.92} metalness={0.02} />
              </mesh>
              {/* Foliage */}
              <mesh position={[0, 5.2, 0]} castShadow>
                <coneGeometry args={[3.0, 5.8, 8]} />
                <meshStandardMaterial
                  color={isNight ? '#064e3b' : '#16a34a'}
                  roughness={0.82}
                  metalness={0.02}
                />
              </mesh>
            </group>
          ))}
        </React.Fragment>
      ))}

      {/* Contact Shadows under buildings */}
      <ContactShadows
        position={[0, 0.07, 0]}
        opacity={isNight ? 0.45 : 0.7}
        scale={240}
        blur={2.8}
        far={14}
        color={isNight ? '#0f0f2c' : '#1e293b'}
      />
    </group>
  );
};

// ── Main Exported Scene Component ──
export const Campus3DScene: React.FC<Campus3DSceneProps> = ({
  locations,
  selectedPoi,
  highlightedPoiIds,
  activeCategory,
  cameraMode,
  isNightMode,
  timeOfDay = isNightMode ? 'night' : 'day',
  sunAngle = 45,
  renderPreset = 'photorealistic',
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
  const sunX = Math.cos(rad) * 130;
  const sunY = Math.sin(rad) * 130;
  const sunPos: [number, number, number] = [sunX, sunY, 65];

  const isBlueprint = renderPreset === 'blueprint';
  const isNight = timeOfDay === 'night';
  const isDusk = timeOfDay === 'dusk';
  const isPerformance = renderPreset === 'performance';

  // Environment preset based on time of day
  const envPreset = isNight ? 'night' : isDusk ? 'sunset' : 'city';

  return (
    <div className="w-full h-full relative bg-slate-950 select-none overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 65, 115], fov: 44, near: 0.1, far: 700 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{
          antialias: !isPerformance,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isNight ? 0.55 : isDusk ? 0.8 : 1.05,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
        }}
      >
        {/* ── HDR Environment Map — realistic reflections & lighting ── */}
        {!isBlueprint && (
          <Environment
            preset={envPreset as any}
            background={false}
            blur={0.4}
          />
        )}

        {/* ── Atmosphere & Lighting ── */}
        {isNight ? (
          <>
            <color attach="background" args={['#040810']} />
            <ambientLight intensity={0.25} color="#3b4f72" />
            <directionalLight
              position={sunPos}
              intensity={0.35}
              color="#93c5fd"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={300}
              shadow-camera-left={-150}
              shadow-camera-right={150}
              shadow-camera-top={150}
              shadow-camera-bottom={-150}
            />
            <hemisphereLight args={['#0c1a3b', '#050811', 0.3]} />
            <Stars radius={180} depth={65} count={5000} factor={5} saturation={0} fade speed={0.8} />
          </>
        ) : isDusk ? (
          <>
            <color attach="background" args={['#1c1340']} />
            <ambientLight intensity={0.45} color="#fb7185" />
            <directionalLight
              position={sunPos}
              intensity={0.9}
              color="#fb923c"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <hemisphereLight args={['#e879f9', '#1e0836', 0.4]} />
            <Sky sunPosition={[sunX, 8, 65]} inclination={0.62} azimuth={0.24} />
          </>
        ) : (
          <>
            <color attach="background" args={['#0f172a']} />
            <ambientLight intensity={0.7} color="#e2e8f0" />
            <directionalLight
              position={sunPos}
              intensity={1.45}
              color="#fff8e1"
              castShadow
              shadow-mapSize-width={4096}
              shadow-mapSize-height={4096}
              shadow-camera-far={350}
              shadow-camera-left={-160}
              shadow-camera-right={160}
              shadow-camera-top={160}
              shadow-camera-bottom={-160}
              shadow-bias={-0.0005}
            />
            <hemisphereLight args={['#bfdbfe', '#1e3a2b', 0.5]} />
            <Sky sunPosition={sunPos} />
          </>
        )}

        {/* ── Rain ── */}
        {isRainActive && <MonsoonRainEffect />}

        {/* ── Camera Rig ── */}
        <CameraRig selectedPoi={selectedPoi} cameraMode={cameraMode} controlsRef={controlsRef} />

        {/* ── Orbit Controls ── */}
        {(cameraMode === 'orbit' || cameraMode === 'aerial') && (
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.055}
            maxPolarAngle={cameraMode === 'aerial' ? Math.PI / 4.2 : Math.PI / 2.05}
            minDistance={14}
            maxDistance={250}
            target={[0, 0, 0]}
            rotateSpeed={0.7}
            zoomSpeed={1.0}
          />
        )}

        {/* ── First Person Mode ── */}
        <FirstPersonControls active={cameraMode === 'fps'} onExitFPS={onExitFPS} />

        {/* ── Ground & Infrastructure (PBR) ── */}
        <Suspense fallback={null}>
          <GroundLayer isBlueprint={isBlueprint} isNight={isNight} isRainActive={isRainActive} />
        </Suspense>

        {/* ── 3D Building Models (PBR upgraded) ── */}
        <Suspense fallback={null}>
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
        </Suspense>

        {/* ── Route Path ── */}
        {routePoints.length > 0 && <PathwayLine3D points={routePoints} />}

        {/* ── Post-Processing Stack ── */}
        {!isBlueprint && (
          <PostProcessingEffects
            renderPreset={renderPreset as any}
            isNightMode={isNight}
          />
        )}
      </Canvas>
    </div>
  );
};
