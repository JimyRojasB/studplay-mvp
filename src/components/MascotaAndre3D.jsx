import { Canvas } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Environment,
  useGLTF,
  Center
} from "@react-three/drei";

function RobotModel() {

  const modelo = useGLTF("/models/mascota.glb");

  return (
    <Center>
      <primitive
        object={modelo.scene}
        scale={1.5}
        position={[0, -1, 0]}
      />
    </Center>
  );
}

export default function MascotaAndre3D() {

  return (
    <div className="w-full h-full">

      <Canvas
        camera={{
          position: [0, 0, 6],
          fov: 45
        }}
      >

        {/* Luces */}
        <ambientLight intensity={2} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={4}
        />

        <pointLight
          position={[-5, 5, 5]}
          intensity={3}
          color="#22d3ee"
        />

        {/* Ambiente */}
        <Environment preset="city" />

        {/* Animación */}
        <Float
          speed={2}
          rotationIntensity={1}
          floatIntensity={2}
        >

          <RobotModel />

        </Float>

        {/* Cámara */}
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={2}
        />

      </Canvas>

    </div>
  );
}