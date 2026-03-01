import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../../context/WeatherContext';
import GlassCard from '../ui/GlassCard';
import { Wind, Droplets, Gauge, Eye, Sunrise, Sunset, Clock } from 'lucide-react';

const toF = (c) => ((c * 9) / 5 + 32).toFixed(1);
const fmtTime = (ts) => new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * Returns a live-updating { time, date } string for the given timezone offset (seconds from UTC).
 */
const useCityTime = (timezoneOffset) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    if (timezoneOffset == null) return { time: '--:--', date: '' };

    // Get UTC time in ms, then add the city's offset
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityMs = utcMs + timezoneOffset * 1000;
    const cityDate = new Date(cityMs);

    const time = cityDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    const date = cityDate.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    return { time, date };
};

const Row = ({ icon, label, value }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
        <span style={{ color: '#60a5fa', flexShrink: 0 }}>{icon}</span>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', flex: 1 }}>{label}</span>
        <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{value}</span>
    </div>
);

const CurrentWeather = () => {
    const { weatherData, loading, error, unit, toggleUnit } = useWeather();

    // Hook must be called unconditionally (React rules of hooks)
    const timezoneOffset = weatherData?.current?.timezone ?? null;
    const { time: cityTime, date: cityDate } = useCityTime(timezoneOffset);

    if (loading) return (
        <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '360px', gap: '14px' }}>
                <div style={{ width: '36px', height: '36px', border: '2px solid #38bdf8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>Fetching weather…</p>
            </div>
        </GlassCard>
    );

    if (error) return (
        <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' }}>
                <p style={{ color: '#f87171', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>
            </div>
        </GlassCard>
    );

    if (!weatherData) return (
        <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '280px' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 1.7, fontSize: '0.9rem' }}>
                    Awaiting telemetry.<br />Search a location to begin simulation.
                </p>
            </div>
        </GlassCard>
    );

    const { current } = weatherData;
    const tempC = current.main.temp;
    const feelsC = current.main.feels_like;
    const dispTemp = unit === 'C' ? `${Math.round(tempC)}°C` : `${toF(tempC)}°F`;
    const dispFeels = unit === 'C' ? `${Math.round(feelsC)}°C` : `${toF(feelsC)}°F`;

    return (
        <GlassCard>
            {/* City header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
                        {current.name}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: '3px 0 0' }}>
                        {current.sys.country} · {current.weather[0].description}
                    </p>
                </div>
                <img
                    src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}
                    alt="icon"
                    style={{ width: '48px', height: '48px', opacity: 0.9 }}
                />
            </div>

            {/* Live local time */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                marginBottom: '8px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.08)',
            }}>
                <Clock size={14} style={{ color: '#38bdf8', flexShrink: 0 }} />
                <span style={{
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.03em',
                }}>
                    {cityTime}
                </span>
                <span style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.75rem',
                    marginLeft: 'auto',
                }}>
                    {cityDate}
                </span>
            </div>

            {/* Hero temperature */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '10px 0 2px' }}>
                <motion.span
                    key={dispTemp}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 'clamp(3rem, 10vw, 4.5rem)', fontWeight: 200, color: '#fff', lineHeight: 1, letterSpacing: '-0.03em' }}
                >
                    {dispTemp}
                </motion.span>
                <button
                    onClick={toggleUnit}
                    style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        marginTop: '20px',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Switch to °{unit === 'C' ? 'F' : 'C'}
                </button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', margin: '0 0 14px' }}>
                Feels like {dispFeels}
            </p>

            {/* Stats */}
            <div>
                <Row icon={<Wind size={14} />} label="Wind speed" value={`${current.wind.speed} m/s`} />
                <Row icon={<Droplets size={14} />} label="Humidity" value={`${current.main.humidity}%`} />
                <Row icon={<Gauge size={14} />} label="Pressure" value={`${current.main.pressure} hPa`} />
                <Row icon={<Eye size={14} />} label="Visibility" value={`${(current.visibility / 1000).toFixed(1)} km`} />
                <Row icon={<Sunrise size={14} />} label="Sunrise" value={fmtTime(current.sys.sunrise)} />
                <Row icon={<Sunset size={14} />} label="Sunset" value={fmtTime(current.sys.sunset)} />
            </div>
        </GlassCard>
    );
};

export default CurrentWeather;
