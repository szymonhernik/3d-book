"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Book from "./components/Book";

export default function Home() {
  return (
    <div className="w-full h-screen bg-[hsl(112,59%,17%)]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-5, 3, 0]} intensity={0.3} />
          {/* Bottom book */}
          <Book
            position={[0, -0.5, 0]}
            width={1.7}
            height={2.5}
            depth={0.2}
            castShadow
            receiveShadow
          />

          {/* Top book - slightly offset */}
          <Book
            position={[0.1, 1.8, 0.05]}
            width={1.7}
            height={2.5}
            depth={0.2}
            castShadow
            receiveShadow
          />
          <OrbitControls enablePan={false} enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
