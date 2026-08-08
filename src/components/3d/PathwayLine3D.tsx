import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PathwayLine3DProps {
  points: [number, number, number][];
}

export const PathwayLine3D: React.FC<PathwayLine3DProps> = ({ points }) => {
  const lineRef = useRef<THREE.Mesh>(null);

  // Convert points to Vector3 array
  const vecPoints = points.map((p) => new THREE.Vector3(p[0], p[1] + 0.3, p[2]));
  const curve = new THREE.CatmullRomCurve3(vecPoints, false, 'catmullrom', 0.2);

  // Animate tube glow along path
  useFrame((state) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = Math.sin(state.clock.elapsedTime * 5) * 0.4 + 0.8;
      }
    }
  });

  if (points.length < 2) return null;

  return (
    <group>
      {/* 3D Tube Path */}
      <mesh ref={lineRef}>
        <tubeGeometry args={[curve, points.length * 12, 0.4, 8, false]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.9}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Start Waypoint Beacon Ring */}
      <mesh position={vecPoints[0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 16]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.7} />
      </mesh>

      {/* Destination Waypoint Beacon Ring */}
      <mesh position={vecPoints[vecPoints.length - 1]}>
        <cylinderGeometry args={[1.8, 1.8, 0.2, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};
