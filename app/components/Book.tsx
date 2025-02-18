"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface BookProps {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  receiveShadow?: boolean;
  castShadow?: boolean;
}

export default function Book({
  position,
  width,
  height,
  depth,
  receiveShadow = true,
  castShadow = true,
}: BookProps) {
  const mesh = useRef<THREE.Mesh>(null!);
  const { viewport, camera } = useThree();

  // Load textures
  const coverTexture = useTexture("/6/Cover.png");
  const spineTexture = useTexture("/6/Spine.png");

  // Create vertical pages texture (for right side)
  const pagesTextureVertical = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#f5f5f5";
      context.fillRect(0, 0, 256, 256);

      // Vertical lines
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 256;
        context.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.3 + 0.1})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, 256);
        context.stroke();
      }

      for (let i = 0; i < 10; i++) {
        const x = Math.random() * 256;
        context.strokeStyle = `rgba(0, 0, 0, 0.5)`;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, 256);
        context.stroke();
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Create horizontal pages texture (for top/bottom)
  const pagesTextureHorizontal = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#f5f5f5";
      context.fillRect(0, 0, 256, 256);

      // Horizontal lines
      for (let i = 0; i < 50; i++) {
        const y = Math.random() * 256;
        context.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.3 + 0.1})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(256, y);
        context.stroke();
      }

      for (let i = 0; i < 10; i++) {
        const y = Math.random() * 256;
        context.strokeStyle = `rgba(0, 0, 0, 0.5)`;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(256, y);
        context.stroke();
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Create a separate object to handle rotation
  const rotationObject = useRef(new THREE.Object3D());

  useEffect(() => {
    // Set initial position
    mesh.current.position.set(...position);

    // Adjust texture wrapping and repeat
    coverTexture.wrapS = coverTexture.wrapT = THREE.ClampToEdgeWrapping;
    spineTexture.wrapS = spineTexture.wrapT = THREE.ClampToEdgeWrapping;
    pagesTextureVertical.wrapS = pagesTextureVertical.wrapT =
      THREE.RepeatWrapping;
    pagesTextureHorizontal.wrapS = pagesTextureHorizontal.wrapT =
      THREE.RepeatWrapping;

    coverTexture.repeat.set(1, 1);
    spineTexture.repeat.set(1, 1);
    pagesTextureVertical.repeat.set(5, 1);
    pagesTextureHorizontal.repeat.set(1, 5);
  }, [
    position,
    coverTexture,
    spineTexture,
    pagesTextureVertical,
    pagesTextureHorizontal,
  ]);

  useFrame((state) => {
    if (!mesh.current) return;

    // Calculate target rotation based on mouse position
    const x = (state.mouse.x * viewport.width) / 2;
    const y = (state.mouse.y * viewport.height) / 2;
    rotationObject.current.position.set(x, y, 2);
    rotationObject.current.lookAt(camera.position);

    // Interpolate current rotation to target rotation
    const targetRotationX = rotationObject.current.rotation.x;
    const targetRotationY = rotationObject.current.rotation.y;

    mesh.current.rotation.x +=
      (targetRotationX - mesh.current.rotation.x) * 0.1;
    mesh.current.rotation.y +=
      (targetRotationY - mesh.current.rotation.y) * 0.1;

    // Clamp rotation to prevent back side reveal
    mesh.current.rotation.x = THREE.MathUtils.clamp(
      mesh.current.rotation.x,
      -Math.PI / 4,
      Math.PI / 4
    );
    mesh.current.rotation.y = THREE.MathUtils.clamp(
      mesh.current.rotation.y,
      -Math.PI / 4,
      Math.PI / 4
    );

    // Add a subtle floating animation
    mesh.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <mesh ref={mesh} receiveShadow castShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        attach="material-0"
        map={pagesTextureVertical}
      />{" "}
      {/* Right */}
      <meshStandardMaterial attach="material-1" map={spineTexture} />{" "}
      {/* Left (Spine) */}
      <meshStandardMaterial
        attach="material-2"
        map={pagesTextureHorizontal}
      />{" "}
      {/* Left */}
      <meshStandardMaterial
        attach="material-3"
        map={pagesTextureHorizontal}
      />{" "}
      {/* Top */}
      <meshStandardMaterial attach="material-4" map={coverTexture} />{" "}
      {/* Front */}
      <meshStandardMaterial attach="material-5" color="#f0f0f0" /> {/* Back */}
    </mesh>
  );
}
