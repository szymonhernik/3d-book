"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Book from "./components/Book";

export default function Home() {
  return (
    <div className="w-full h-screen bg-[#7e7a80]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={1.6} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-5, 3, 0]} intensity={0.6} />
          {/* Bottom book */}
          <Book
            position={[0, 0, 0]}
            width={book6.width}
            height={book6.height}
            depth={book6.depth}
            castShadow
            receiveShadow
          />

          {/* Top book - slightly offset */}
          {/* <Book
            position={[0.1, 1.8, 0.05]}
            width={1.7}
            height={2.5}
            depth={0.2}
            castShadow
            receiveShadow
          /> */}
          <OrbitControls enablePan={false} enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// alien dauthers day 2
const book1 = {
  position: [0, 0, 0],
  width: 1.4,
  height: 2.5,
  depth: 0.3,
};
const book2 = {
  position: [0, 0, 0],
  width: 1.68,
  height: 2.5,
  depth: 0.4,
};
const book3 = {
  position: [0, 0, 0],
  width: 1.6,
  height: 2.4,
  depth: 0.3,
};
const book4 = {
  position: [0, 0, 0],
  width: 1.7,
  height: 2.5,
  depth: 0.5,
};

const book5 = {
  position: [0, 0, 0],
  width: 1.4,
  height: 2.34,
  depth: 0.2,
};

const book6 = {
  position: [0, 0, 0],
  width: 1.6,
  height: 2.52,
  depth: 0.18,
};

const book7 = {
  position: [0, 0, 0],
  width: 1.6,
  height: 2.52,
  depth: 0.18,
};
