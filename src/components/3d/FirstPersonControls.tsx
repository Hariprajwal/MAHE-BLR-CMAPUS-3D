import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FirstPersonControlsProps {
  active: boolean;
  onExitFPS: () => void;
}

export const FirstPersonControls: React.FC<FirstPersonControlsProps> = ({ active, onExitFPS }) => {
  const { camera, gl } = useThree();
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false
  });

  const isLocked = useRef(false);
  const yaw = useRef(0);
  const pitch = useRef(0);

  useEffect(() => {
    if (!active) return;

    // Reset camera position for ground exploration near Central Plaza
    camera.position.set(0, 1.8, 15);
    camera.rotation.set(0, 0, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': moveState.current.forward = true; break;
        case 'KeyS': case 'ArrowDown': moveState.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft': moveState.current.left = true; break;
        case 'KeyD': case 'ArrowRight': moveState.current.right = true; break;
        case 'ShiftLeft': case 'ShiftRight': moveState.current.shift = true; break;
        case 'Escape': onExitFPS(); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': moveState.current.forward = false; break;
        case 'KeyS': case 'ArrowDown': moveState.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft': moveState.current.left = false; break;
        case 'KeyD': case 'ArrowRight': moveState.current.right = false; break;
        case 'ShiftLeft': case 'ShiftRight': moveState.current.shift = false; break;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      yaw.current -= movementX * 0.002;
      pitch.current -= movementY * 0.002;

      // Clamp pitch look angle
      pitch.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch.current));

      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.x = pitch.current;
      euler.y = yaw.current;
      camera.quaternion.setFromEuler(euler);
    };

    const handleClick = () => {
      if (!isLocked.current) {
        gl.domElement.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock();
      }
    };
  }, [active, camera, gl, onExitFPS]);

  useFrame((_, delta) => {
    if (!active) return;

    const speed = moveState.current.shift ? 18.0 : 8.0;
    const moveVector = new THREE.Vector3(0, 0, 0);

    if (moveState.current.forward) moveVector.z -= 1;
    if (moveState.current.backward) moveVector.z += 1;
    if (moveState.current.left) moveVector.x -= 1;
    if (moveState.current.right) moveVector.x += 1;

    moveVector.normalize();
    moveVector.applyEuler(new THREE.Euler(0, yaw.current, 0, 'YXZ'));

    camera.position.addScaledVector(moveVector, speed * delta);
    // Keep eye height constrained to campus ground level (1.8m above ground)
    camera.position.y = 1.8;

    // Enforce campus ground perimeter boundary limits [-70, 70]
    camera.position.x = Math.max(-65, Math.min(65, camera.position.x));
    camera.position.z = Math.max(-60, Math.min(65, camera.position.z));
  });

  return null;
};
