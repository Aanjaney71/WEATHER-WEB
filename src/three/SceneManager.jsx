import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import Sunny from './environments/Sunny';
import Cloudy from './environments/Cloudy';
import Rain from './environments/Rain';
import Night from './environments/Night';
import Wind from './environments/Wind';

const envMap = { Sunny, Cloudy, Rain, Night, Wind };

function SceneContent({ theme, prevTheme, transitioning }) {
    const CurrentEnv = envMap[theme];
    const PrevEnv = transitioning && prevTheme && prevTheme !== theme ? envMap[prevTheme] : null;

    useFrame((state) => {
        if (state.clock.getElapsedTime() < 0.1) {
            console.log("Canvas is rendering! Camera Position:", state.camera.position);
            console.log("Scene Children:", state.scene.children.length);
        }
    });

    return (
        <>
            {PrevEnv && <PrevEnv active={false} />}
            {CurrentEnv && <CurrentEnv active={true} isTransitioning={transitioning} />}
        </>
    );
}

const SceneManager = ({ theme = 'Sunny', prevTheme = 'Sunny', transitioning = false, performanceMode = false }) => {
    return (
        <Canvas
            camera={{ position: [0, 2, 12], fov: 55, near: 0.1, far: 2000 }}
            dpr={performanceMode ? 1 : [1, 1.5]}
            gl={{
                antialias: !performanceMode,
                powerPreference: 'high-performance',
                alpha: true,        // transparent canvas — CSS sky shows through
            }}
            style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%',
                height: '100%',
                display: 'block',
            }}
        >
            <Suspense fallback={null}>
                <SceneContent theme={theme} prevTheme={prevTheme} transitioning={transitioning} />
            </Suspense>
        </Canvas>
    );
};

export default SceneManager;
