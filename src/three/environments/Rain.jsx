import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SkyDome, CloudLayer, FadingLight } from '../components/SkyDecorations';

// 3D Rain lines
const RainParticles = ({ active = true }) => {
    const COUNT = 1200;
    const ref = useRef();
    const matRef = useRef();
    const initOpacity = useRef(active ? 0.4 : 0);

    const positions = useMemo(() => {
        const pos = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 200; // x spread
            pos[i * 3 + 1] = Math.random() * 200; // y height
            pos[i * 3 + 2] = (Math.random() - 0.5) * 150 - 20; // z depth
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (matRef.current) {
            const targetOpacity = active ? 0.4 : 0;
            matRef.current.opacity += (targetOpacity - matRef.current.opacity) * delta * 2.0;
        }

        if (!ref.current) return;
        const positions = ref.current.geometry.attributes.position.array;

        // Fast falling rain
        for (let i = 0; i < COUNT; i++) {
            positions[i * 3 + 1] -= delta * 180;
            // slightly angled falling
            positions[i * 3] -= delta * 10;
            if (positions[i * 3 + 1] < -20) {
                positions[i * 3 + 1] = 200;
            }
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
            </bufferGeometry>
            {/* Vertical stretching for rain lines */}
            <pointsMaterial ref={matRef} color="#a0c8ff" size={0.6} sizeAttenuation={true} transparent opacity={initOpacity.current} />
            <mesh scale={[1, 15, 1]} />
        </points>
    );
};

// Rain = Very dark 3D SkyDome + 3D Rain particles + Dark 3D Clouds
const Rain = ({ active = true }) => {
    return (
        <group>
            {/* Very dark environment lighting */}
            <FadingLight intensity={0.15} color="#607080" active={active} />
            <FadingLight type="hemisphere" intensity={0.2} color="#405060" groundColor="#101520" active={active} />

            {/* Deep 3D Background */}
            <SkyDome texturePath="/textures/bg_rain.png" colorFilter="#707070" active={active} />

            {/* Rain elements */}
            <RainParticles active={active} />

            {/* Dense 3D Drifting Clouds layers */}
            <CloudLayer texturePath="/textures/cloud_storm.png" count={10} speed={1.3} brightness={0.3} yOffset={20} active={active} />
            <CloudLayer texturePath="/textures/cloud_storm.png" count={6} speed={1.8} brightness={0.2} yOffset={60} active={active} />
        </group>
    );
};

export default Rain;
