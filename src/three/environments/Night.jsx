import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { SkyDome, CloudLayer, FadingLight } from '../components/SkyDecorations';

// Realistic moon with texture + breathing glow halos
const Moon3D = ({ active = true }) => {
    const moonTex = useLoader(TextureLoader, '/textures/moon.png');
    const bodyRef = useRef();
    const materialRef = useRef();
    const h1Mat = useRef();
    const h2Mat = useRef();

    const initOp = useRef(active ? 1 : 0);
    const initH1 = useRef(active ? 0.16 : 0);
    const initH2 = useRef(active ? 0.07 : 0);

    useFrame(({ clock }, delta) => {
        const t = clock.getElapsedTime();
        const targetGlobalOpacity = active ? 1 : 0;

        if (bodyRef.current) bodyRef.current.rotation.y += 0.0002;

        if (materialRef.current) {
            materialRef.current.opacity += (targetGlobalOpacity - materialRef.current.opacity) * delta * 2.0;
        }

        if (h1Mat.current) {
            const h1Target = (0.18 + Math.sin(t * 0.5) * 0.07) * targetGlobalOpacity;
            h1Mat.current.opacity += (h1Target - h1Mat.current.opacity) * delta * 2.0;
        }
        if (h2Mat.current) {
            const h2Target = (0.08 + Math.sin(t * 0.3 + 1) * 0.04) * targetGlobalOpacity;
            h2Mat.current.opacity += (h2Target - h2Mat.current.opacity) * delta * 2.0;
        }
    });

    return (
        <group position={[20, 40, -80]}>
            {/* Outer atmospheric halo */}
            <mesh>
                <sphereGeometry args={[14, 32, 32]} />
                <meshBasicMaterial ref={h2Mat} color="#b0c8f8" transparent opacity={initH2.current} side={THREE.BackSide} />
            </mesh>
            {/* Inner glow halo */}
            <mesh>
                <sphereGeometry args={[9.5, 32, 32]} />
                <meshBasicMaterial ref={h1Mat} color="#d0e0ff" transparent opacity={initH1.current} side={THREE.BackSide} />
            </mesh>
            {/* Moon sphere with real texture */}
            <mesh ref={bodyRef}>
                <sphereGeometry args={[6, 64, 64]} />
                <meshStandardMaterial
                    ref={materialRef}
                    map={moonTex}
                    transparent={true}
                    opacity={initOp.current}
                    emissive="#b0a070"
                    emissiveIntensity={0.15}
                    roughness={0.95}
                    metalness={0}
                />
            </mesh>
            {/* Point light to simulate moonlight shining strongly onto clouds */}
            <FadingLight type="point" color="#c8d8ff" intensity={5} distance={300} decay={1.5} active={active} />
        </group>
    );
};

// 3D twinkling star particles in upper hemisphere
const Stars3D = ({ active = true }) => {
    const COUNT = 1200;
    const ref = useRef();
    const matRef = useRef();
    const initOpacity = useRef(active ? 0.8 : 0);

    const positions = useMemo(() => {
        const pos = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(1 - Math.random() * 1.6); // upper hemisphere bias
            const r = 80 + Math.random() * 80;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.cos(phi);
            pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
        return pos;
    }, []);

    useFrame(({ clock }, delta) => {
        if (!matRef.current) return;
        const targetGlobalOpacity = active ? 1 : 0;
        const targetOp = (0.6 + Math.sin(clock.getElapsedTime() * 2) * 0.4) * targetGlobalOpacity;
        matRef.current.opacity += (targetOp - matRef.current.opacity) * delta * 2.0;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial ref={matRef} size={1.5} sizeAttenuation={true} color="#ffffff" transparent opacity={initOpacity.current} />
        </points>
    );
};

// Night = 3D moon + 3D Stars + Dark 3D Clouds + 3D SkyDome
const Night = ({ active = true }) => (
    <group>
        <FadingLight intensity={0.05} color="#101830" active={active} />
        <SkyDome texturePath="/textures/bg_night.png" colorFilter="#ffffff" active={active} />
        <Stars3D active={active} />
        <Moon3D active={active} />

        {/* Dark, slow drifting 3D clouds */}
        <CloudLayer texturePath="/textures/cloud_wide.png" count={8} speed={0.4} brightness={0.15} yOffset={10} active={active} />
    </group>
);

export default Night;
