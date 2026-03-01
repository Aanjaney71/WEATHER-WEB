import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Zap, ZapOff } from 'lucide-react';

const PerformanceToggle = () => {
    const { performanceMode, togglePerformanceMode } = useWeather();

    return (
        <button
            onClick={togglePerformanceMode}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 shadow-lg ${performanceMode
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                    : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
            title={performanceMode ? "Disable Performance Mode" : "Enable Performance Mode (Saves Battery/GPU)"}
        >
            {performanceMode ? <ZapOff size={18} /> : <Zap size={18} />}
            <span className="text-sm font-medium hidden md:block">
                {performanceMode ? 'Fast Mode' : 'Immersive Mode'}
            </span>
        </button>
    );
};

export default PerformanceToggle;
