import { Canvas } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Environment,
  useGLTF
} from "@react-three/drei";

function ModeloMascota() {
  const { scene } = useGLTF("/models/mascota.glb");

  return (
    <primitive
      object={scene}
      scale={2}
      position={[0, -1, 0]}
    />
  );
}

export default function Mascota3D() {
  return (
    <div className="w-full h-[350px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>

        <ambientLight intensity={1.5} />

        <directionalLight
          position={[2, 2, 2]}
          intensity={3}
        />

        <pointLight
          position={[-2, 2, 2]}
          intensity={2}
          color="#22d3ee"
        />

        <Environment preset="city" />

        <Float
          speed={2}
          rotationIntensity={1}
          floatIntensity={2}
        >
          <ModeloMascota />
        </Float>

        <OrbitControls
          enableZoom={false}
          autoRotate
        />
      </Canvas>
    </div>
  );
}