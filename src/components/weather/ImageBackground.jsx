import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const backgrounds = {
    Sunny: '/textures/bg_sunny.png',
    Night: '/textures/stars.png',
    Rain: '/textures/bg_rain.png',
    RainNight: '/textures/bg_rain.png',
    Cloudy: '/textures/bg_cloudy.png',
    CloudyNight: '/textures/bg_cloudy.png',
    Wind: '/textures/bg_wind.png',
    WindNight: '/textures/bg_wind.png',
    Storm: '/textures/storm.png',
    StormNight: '/textures/storm.png'
};

const ImageBackground = ({ theme }) => {
    return (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#0a0a0a' }}>
            <AnimatePresence>
                <motion.img
                    key={theme}
                    src={backgrounds[theme] || backgrounds.Sunny}
                    alt={theme}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                />
            </AnimatePresence>

            {/* Moon for Night Theme */}
            <AnimatePresence>
                {theme.includes('Night') && (
                    <motion.img
                        key="moon"
                        src="/textures/moon_realistic.png"
                        alt="moon"
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -50 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        style={{
                            position: 'absolute',
                            top: '8%',
                            right: '12%',
                            width: '280px',
                            height: '280px',
                            objectFit: 'contain',
                            mixBlendMode: 'screen', // Blend isolated black background
                        }}
                    />
                )}
            </AnimatePresence>



            {/* Floating Clouds Layer */}
            <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 1
            }}>
                {/* 
                    Apply horizontal mask directly to the wide clouds to fade out their sharp left/right edges 
                    Positions adjusted to be at the top of the screen (behind title & search)
                */}

                {/* Left to right */}
                <img src="/textures/cloud.png" alt="cloud" style={{
                    position: 'absolute', top: '10%', width: '12vw', opacity: 1,
                    animation: 'drift-lr 80s linear infinite',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
                }} />
                <img src="/textures/cloud_wide.png" alt="cloud" style={{
                    position: 'absolute', top: '18%', width: '16vw', opacity: 1,
                    animation: 'drift-lr 120s linear infinite -40s',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
                }} />
                <img src="/textures/cloud.png" alt="cloud" style={{
                    position: 'absolute', top: '5%', width: '14vw', opacity: 0.8,
                    animation: 'drift-lr 105s linear infinite -75s',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
                }} />

                {/* Right to left */}
                <img src="/textures/cloud_wide.png" alt="cloud" style={{
                    position: 'absolute', top: '12%', width: '15vw', opacity: 1,
                    animation: 'drift-rl 100s linear infinite -20s',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
                }} />
                <img src="/textures/cloud.png" alt="cloud" style={{
                    position: 'absolute', top: '22%', width: '10vw', opacity: 1,
                    animation: 'drift-rl 90s linear infinite -60s',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
                }} />
                <img src="/textures/cloud_wide.png" alt="cloud" style={{
                    position: 'absolute', top: '25%', width: '18vw', opacity: 0.9,
                    animation: 'drift-rl 140s linear infinite -90s',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
                }} />
            </div>

            {/* Gradient Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: theme.includes('Night')
                    ? 'linear-gradient(to bottom, rgba(2, 6, 23, 0.7), rgba(0, 0, 0, 0.95))'
                    : 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))',
                pointerEvents: 'none',
                zIndex: 2,
                transition: 'background 1.5s ease-in-out'
            }} />
        </div>
    );
};

export default ImageBackground;
