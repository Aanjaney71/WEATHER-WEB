import React from 'react';
import { SkyDome, CloudLayer, FadingLight } from '../components/SkyDecorations';

// Cloudy = Dark 3D SkyDome + Many dense 3D Clouds drifting
const Cloudy = ({ active = true }) => {
    return (
        <group>
            {/* Darker, flatter environment lighting */}
            <FadingLight intensity={0.3} color="#a0b0c0" active={active} />
            <FadingLight type="directional" position={[10, 50, 10]} intensity={0.2} color="#ffffff" active={active} />

            {/* Deep 3D Background */}
            <SkyDome texturePath="/textures/bg_cloudy.png" colorFilter="#a0a0a0" active={active} />

            {/* Dense 3D Drifting Clouds layers */}
            <CloudLayer texturePath="/textures/cloud_storm.png" count={12} speed={1.0} brightness={0.6} yOffset={10} active={active} />
            <CloudLayer texturePath="/textures/cloud_storm.png" count={8} speed={1.5} brightness={0.5} yOffset={40} active={active} />
        </group>
    );
};

export default Cloudy;
