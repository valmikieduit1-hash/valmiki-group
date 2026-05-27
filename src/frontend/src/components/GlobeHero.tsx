import { OrbitControls, Stars, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

interface CountryMarker {
  name: string;
  slug: string;
  lat: number;
  lon: number;
}

const countryMarkers: CountryMarker[] = [
  { name: "USA", slug: "usa", lat: 37.09, lon: -95.71 },
  { name: "Canada", slug: "canada", lat: 56.13, lon: -106.35 },
  { name: "UK", slug: "uk", lat: 55.38, lon: -3.44 },
  { name: "Australia", slug: "australia", lat: -25.27, lon: 133.78 },
  { name: "Germany", slug: "germany", lat: 51.17, lon: 10.45 },
  { name: "Ireland", slug: "ireland", lat: 53.41, lon: -8.24 },
  { name: "New Zealand", slug: "new-zealand", lat: -40.9, lon: 174.89 },
  { name: "Dubai", slug: "dubai", lat: 25.2, lon: 55.27 },
  { name: "Singapore", slug: "singapore", lat: 1.35, lon: 103.82 },
  { name: "Europe", slug: "europe", lat: 48.86, lon: 2.35 },
];

function latLonToVector3(
  lat: number,
  lon: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function GlobeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  const gridMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#1a3a5c"),
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
  }, []);

  const innerMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#0B1F3A"),
      transparent: true,
      opacity: 0.95,
    });
  }, []);

  return (
    <group>
      <mesh ref={meshRef} material={innerMaterial}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>
      <mesh material={gridMaterial}>
        <sphereGeometry args={[2.01, 32, 32]} />
      </mesh>
    </group>
  );
}

function CountryMarkers() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleClick = useCallback(
    (slug: string) => {
      navigate(`/countries/${slug}`);
    },
    [navigate],
  );

  return (
    <group>
      {countryMarkers.map((country) => {
        const pos = latLonToVector3(country.lat, country.lon, 2.08);
        const isHovered = hovered === country.slug;

        return (
          <group key={country.slug} position={pos}>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: Three.js mesh is not a DOM element */}
            <mesh
              onClick={() => handleClick(country.slug)}
              onPointerOver={() => setHovered(country.slug)}
              onPointerOut={() => setHovered(null)}
            >
              <sphereGeometry args={[isHovered ? 0.06 : 0.04, 16, 16]} />
              <meshBasicMaterial
                color={isHovered ? "#FF8A00" : "#FFC247"}
                transparent
                opacity={isHovered ? 1 : 0.85}
              />
            </mesh>
            {isHovered && (
              <Text
                position={[0, 0.12, 0]}
                fontSize={0.08}
                color="#FF8A00"
                anchorX="center"
                anchorY="bottom"
                font="/assets/fonts/GeneralSans.woff2"
              >
                {country.name}
              </Text>
            )}
            <mesh>
              <ringGeometry args={[0.06, 0.08, 32]} />
              <meshBasicMaterial
                color="#FFC247"
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[2.3, 64, 64]} />
      <meshBasicMaterial
        color="#0B1F3A"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <GlobeSphere />
      <CountryMarkers />
      <Atmosphere />
    </group>
  );
}

export default function GlobeHero() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} intensity={0.4} color="#FF8A00" />
        <Stars
          radius={80}
          depth={50}
          count={2000}
          factor={3}
          saturation={0}
          fade
          speed={0.5}
        />
        <Scene />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3.5}
          maxDistance={8}
          autoRotate={false}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
