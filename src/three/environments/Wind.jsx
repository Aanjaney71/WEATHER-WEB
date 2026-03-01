import React from 'react';
import { SkyDome, CloudLayer, FadingLight } from '../components/SkyDecorations';

// Wind = Sunny 3D SkyDome + Extremely fast moving 3D Clouds
const Wind = ({ active = true }) => {
    return (
        <group>
            {/* Crisp lighting */}
            <FadingLight intensity={0.7} color="#e0f0ff" active={active} />
            <FadingLight type="directional" position={[100, 50, 20]} intensity={1.8} color="#ffffff" active={active} />

            {/* Deep 3D Background */}
            <SkyDome texturePath="/textures/bg_wind.png" active={active} />

            {/* Fast 3D Drifting Clouds layers */}
            <CloudLayer texturePath="/textures/cloud_wide.png" count={8} speed={3.5} brightness={0.95} yOffset={15} active={active} />
            <CloudLayer texturePath="/textures/cloud_wide.png" count={5} speed={4.8} brightness={1.1} yOffset={45} active={active} />
        </group>
    );
};

export default Wind;
