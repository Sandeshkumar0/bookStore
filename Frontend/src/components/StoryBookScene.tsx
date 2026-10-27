import { Canvas, useFrame } from "@react-three/fiber";
import { type MutableRefObject, useMemo, useRef } from "react";
import * as THREE from "three";

import { useReducedMotion } from "../hooks/useReducedMotion";

const clamp = THREE.MathUtils.clamp;
const smooth = (value: number, start: number, end: number) => {
  const t = clamp((value - start) / (end - start), 0, 1);
  return t * t * (3 - 2 * t);
};

function Page({ index, progressRef }: { index: number; progressRef: MutableRefObject<number> }) {
  const pivot = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!pivot.current) return;
    const start = 0.47 + index * 0.035;
    const turn = smooth(progressRef.current, start, start + 0.12);
    pivot.current.rotation.y = -turn * Math.PI * 0.94;
    pivot.current.rotation.z = Math.sin(turn * Math.PI) * (0.035 + index * 0.004);
  });

  return (
    <group ref={pivot} position={[-1.55, 0.08 + index * 0.012, 0.13 + index * 0.006]}>
      <mesh position={[1.55, 0, 0]} receiveShadow>
        <boxGeometry args={[3.08, 4.28, 0.012, 2, 2]} />
        <meshStandardMaterial color={index % 2 ? "#e8deca" : "#f1e8d5"} roughness={0.94} />
      </mesh>
      <mesh position={[1.55, 0, 0.008]}>
        <planeGeometry args={[2.45, 3.55]} />
        <meshStandardMaterial color={index === 2 ? "#7b3024" : "#d7cbb4"} transparent opacity={index === 2 ? 0.16 : 0.08} roughness={1} />
      </mesh>
    </group>
  );
}

function Hardcover({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const book = useRef<THREE.Group>(null);
  const front = useRef<THREE.Group>(null);
  const portal = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const progress = progressRef.current;
    const group = book.current;
    if (!group || !front.current || !portal.current) return;

    const reveal = smooth(progress, 0.1, 0.3);
    const opening = smooth(progress, 0.31, 0.51);
    const deep = smooth(progress, 0.68, 0.82);
    const returnHome = smooth(progress, 0.84, 0.98);

    const targetX = THREE.MathUtils.lerp(0.8, -0.45, reveal) + deep * 1.3 - returnHome * 1.15;
    const targetY = THREE.MathUtils.lerp(-1.45, 0.05, reveal) - deep * 0.2;
    const targetZ = deep * 1.5 - returnHome * 1.25;
    group.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 1 - Math.pow(0.0008, delta));
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, THREE.MathUtils.lerp(-0.08, -1.22, opening) + returnHome * 1.14, 0.06);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, -0.42 + reveal * 0.62 - deep * 0.15, 0.06);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, reveal * -0.08 + returnHome * 0.08, 0.06);
    const scale = 0.86 + reveal * 0.18 + deep * 0.19 - returnHome * 0.17;
    group.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);

    front.current.rotation.y = -opening * Math.PI * 0.94 + returnHome * Math.PI * 0.94;
    portal.current.visible = deep > 0.02 && returnHome < 0.96;
    portal.current.scale.setScalar(0.05 + deep * 0.95);
    portal.current.position.z = 0.23 + deep * 0.35;

    const cameraZ = 9.2 - reveal * 1.2 - deep * 1.7 + returnHome * 2.25;
    state.camera.position.lerp(new THREE.Vector3(deep * 0.4, 0.2 + opening * 0.55, cameraZ), 0.055);
    state.camera.lookAt(0, -0.1, 0);
  });

  return (
    <group ref={book} position={[0.8, -1.45, 0]} rotation={[-0.08, -0.42, 0]}>
      <mesh position={[0, 0, -0.22]} castShadow receiveShadow>
        <boxGeometry args={[3.45, 4.7, 0.2, 4, 4]} />
        <meshStandardMaterial color="#481811" roughness={0.72} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0, -0.09]} castShadow>
        <boxGeometry args={[3.08, 4.3, 0.24]} />
        <meshStandardMaterial color="#e6dcc8" roughness={0.92} />
      </mesh>
      <group ref={front} position={[-1.73, 0, 0.11]}>
        <mesh position={[1.73, 0, 0]} castShadow>
          <boxGeometry args={[3.45, 4.7, 0.18, 4, 4]} />
          <meshStandardMaterial color="#681f17" roughness={0.66} metalness={0.04} />
        </mesh>
        <mesh position={[1.73, 0, 0.101]}>
          <planeGeometry args={[2.62, 3.8]} />
          <meshStandardMaterial color="#8c6c38" roughness={0.38} metalness={0.7} transparent opacity={0.46} />
        </mesh>
        <mesh position={[1.73, 0.5, 0.108]}>
          <boxGeometry args={[2.18, 0.028, 0.012]} />
          <meshStandardMaterial color="#e0bd70" metalness={0.78} roughness={0.25} />
        </mesh>
      </group>
      <mesh position={[-1.7, 0, 0]} castShadow>
        <boxGeometry args={[0.22, 4.72, 0.48]} />
        <meshStandardMaterial color="#3e120e" roughness={0.74} />
      </mesh>
      {Array.from({ length: 5 }, (_, index) => <Page key={index} index={index} progressRef={progressRef} />)}
      <group ref={portal} visible={false} position={[0, 0, 0.23]}>
        <mesh position={[0, 0, 0.02]}>
          <circleGeometry args={[1.15, 48]} />
          <meshStandardMaterial color="#151612" roughness={1} />
        </mesh>
        <mesh position={[0, 0.05, 0.1]}>
          <torusGeometry args={[1.17, 0.055, 10, 48]} />
          <meshStandardMaterial color="#b28d4d" metalness={0.65} roughness={0.4} />
        </mesh>
        {[-0.75, -0.45, 0.48, 0.78].map((x, index) => (
          <mesh key={x} position={[x, -0.55 + (index % 2) * 0.1, 0.18 + index * 0.02]}>
            <coneGeometry args={[0.22 + index * 0.02, 0.8 + index * 0.08, 7]} />
            <meshStandardMaterial color={index % 2 ? "#334238" : "#202d27"} roughness={1} />
          </mesh>
        ))}
        <pointLight position={[0, 0.4, 1]} intensity={4} color="#e9b561" distance={4} />
      </group>
    </group>
  );
}

function ArchiveEnvironment({ compact }: { compact: boolean }) {
  const dust = useMemo(() => {
    const count = compact ? 35 : 90;
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = ((i * 47) % 97) / 8 - 6;
      values[i * 3 + 1] = ((i * 29) % 83) / 9 - 4;
      values[i * 3 + 2] = -((i * 61) % 79) / 8;
    }
    return values;
  }, [compact]);

  return (
    <>
      {!compact && Array.from({ length: 7 }, (_, index) => (
        <group key={index} position={[index % 2 ? 5.3 : -5.3, 0.2, -index * 1.6 + 1]}>
          <mesh receiveShadow><boxGeometry args={[2.4, 6.2, 0.32]} /><meshStandardMaterial color="#191714" roughness={.9} /></mesh>
          {Array.from({ length: 5 }, (__, shelf) => (
            <mesh key={shelf} position={[0, -2.3 + shelf * 1.15, .22]}><boxGeometry args={[2.2, .07, .5]} /><meshStandardMaterial color="#5c4831" roughness={.8} /></mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, -3.56, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.75, 0.3, 48]} />
        <meshStandardMaterial color="#2a2118" roughness={0.55} metalness={0.15} />
      </mesh>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[dust, 3]} /></bufferGeometry>
        <pointsMaterial color="#d2b37e" size={0.025} transparent opacity={0.42} sizeAttenuation />
      </points>
    </>
  );
}

export default function StoryBookScene({ progressRef, compact }: { progressRef: MutableRefObject<number>; compact: boolean }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="story-canvas" role="img" aria-label="A clothbound book rises, opens, turns pages, and reveals a miniature story world as the page scrolls">
      <Canvas
        camera={{ position: [0, 0.2, 9.2], fov: compact ? 44 : 37 }}
        dpr={compact ? 1 : [1, 1.45]}
        gl={{ alpha: true, antialias: !compact, powerPreference: "high-performance" }}
        frameloop={reducedMotion ? "demand" : "always"}
        shadows={!compact}
      >
        <fog attach="fog" args={["#100f0d", 7, 18]} />
        <ambientLight intensity={0.34} />
        <directionalLight position={[3.5, 6, 5]} intensity={3.5} color="#ffd79c" castShadow={!compact} />
        <pointLight position={[-4, 1, 2]} intensity={5} color="#8f2d1f" distance={10} />
        <ArchiveEnvironment compact={compact} />
        <Hardcover progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
