import React from 'react';
import { SkyDome, CloudLayer, FadingLight } from '../components/SkyDecorations';

// Sunny = Bright 3D SkyDome + 3D Clouds drifting
const Sunny = ({ active = true }) => {
    return (
        <group>
            {/* Environment lighting */}
            <FadingLight intensity={0.6} color="#ffffff" active={active} />
            <FadingLight type="directional" position={[100, 100, 50]} intensity={1.5} color="#fff8e7" active={active} />

            {/* Deep 3D Background */}
            <SkyDome texturePath="/textures/bg_sunny.png" active={active} />

            {/* 3D Drifting Clouds layer */}
            <CloudLayer texturePath="/textures/cloud_wide.png" count={7} speed={0.8} brightness={1.0} yOffset={20} active={active} />
            <CloudLayer texturePath="/textures/cloud_wide.png" count={4} speed={1.2} brightness={1.2} yOffset={50} active={active} />
        </group>
    );
};

export default Sunny;
