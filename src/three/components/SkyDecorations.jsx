import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

// Light that crossfades intensity during scene transitions
export const FadingLight = ({ type = 'ambient', active = true, intensity = 1, ...props }) => {
    const lightRef = useRef();
    const initObj = useRef(active ? intensity : 0);

    useFrame((state, delta) => {
        if (!lightRef.current) return;
        const targetIntensity = active ? intensity : 0;
        lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * delta * 2.0;
    });

    if (type === 'directional') return <directionalLight ref={lightRef} intensity={initObj.current} {...props} />;
    if (type === 'hemisphere') return <hemisphereLight ref={lightRef} intensity={initObj.current} {...props} />;
    if (type === 'point') return <pointLight ref={lightRef} intensity={initObj.current} {...props} />;
    return <ambientLight ref={lightRef} intensity={initObj.current} {...props} />;
};

// 3D Background sphere wrapping the scene
export const SkyDome = ({ texturePath, colorFilter = 0xffffff, active = true }) => {
    const texture = useLoader(TextureLoader, texturePath);
    const materialRef = useRef();
    const meshRef = useRef();
    const initOpacity = useRef(active ? 1 : 0);

    useFrame((state, delta) => {
        if (!materialRef.current) return;
        const targetOpacity = active ? 1 : 0;
        const currentOpacity = materialRef.current.opacity;
        materialRef.current.opacity += (targetOpacity - currentOpacity) * delta * 2.0;

        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.015; // Slow 3D rotation
        }
    });

    return (
        <mesh ref={meshRef} renderOrder={-1}>
            {/* Massive sphere, camera is inside it */}
            <sphereGeometry args={[500, 64, 64]} />
            <meshBasicMaterial
                ref={materialRef}
                map={texture}
                color={colorFilter}
                side={THREE.BackSide} /* Render the inside of the sphere */
                toneMapped={false}
                transparent={true}
                depthWrite={false}  /* Don't block other transparent objects like clouds */
                opacity={initOpacity.current}
            />
        </mesh>
    );
};

// 3D Clouds drifting in space
export const CloudLayer = ({ texturePath, count = 5, speed = 1, brightness = 1, yOffset = 0, active = true }) => {
    const cloudTex = useLoader(TextureLoader, texturePath);
    const cloudsRef = useRef([]);
    const initOpacity = useRef(active ? 1 : 0);

    // Pre-generate random properties for clouds
    const cloudsData = useMemo(() => {
        return Array.from({ length: count }, () => {
            const isLTR = Math.random() > 0.5;
            return {
                x: (Math.random() - 0.5) * 300, // Spread widely across X axis
                y: yOffset + (Math.random() - 0.5) * 40, // Altitude 
                z: -50 - Math.random() * 80, // Push back into Z space
                scale: 25 + Math.random() * 30, // Randomize size
                speed: (isLTR ? 1 : -1) * (0.05 + Math.random() * 0.1) * speed,
                baseOpacity: 0.4 + Math.random() * 0.5
            };
        });
    }, [count, speed, yOffset]);

    useFrame((state, delta) => {
        const targetGlobalOpacity = active ? 1 : 0;

        cloudsRef.current.forEach((mesh, index) => {
            if (!mesh) return;
            const data = cloudsData[index];

            // Movement
            mesh.position.x += data.speed * delta * 60; // Frame-rate independent speed

            // Wrap around the scene when moving too far out of view
            if (data.speed > 0 && mesh.position.x > 180) {
                mesh.position.x = -180;
            } else if (data.speed < 0 && mesh.position.x < -180) {
                mesh.position.x = 180;
            }

            // Opacity fade
            if (mesh.material) {
                const targetOpacity = data.baseOpacity * targetGlobalOpacity;
                mesh.material.opacity += (targetOpacity - mesh.material.opacity) * delta * 2.0;
            }
        });
    });

    return (
        <group>
            {cloudsData.map((data, i) => (
                <mesh
                    key={i}
                    ref={el => cloudsRef.current[i] = el}
                    position={[data.x, data.y, data.z]}
                >
                    <planeGeometry args={[data.scale * 2, data.scale]} />
                    <meshBasicMaterial
                        map={cloudTex}
                        color={new THREE.Color(brightness, brightness, brightness)}
                        transparent={true}
                        opacity={initOpacity.current * data.baseOpacity}
                        depthWrite={false}
                        alphaTest={0.01}
                    />
                </mesh>
            ))}
        </group>
    );
};
