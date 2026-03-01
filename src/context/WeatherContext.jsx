import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const WeatherContext = createContext();
export const useWeather = () => useContext(WeatherContext);

const getThemeFromData = (current) => {
    const conditionId = current.weather[0].id;
    const windSpeed = current.wind.speed;

    // Calculate the precise local time for the searched city using its UTC offset
    const localTimeMs = (current.dt + current.timezone) * 1000;
    const localHour = new Date(localTimeMs).getUTCHours();

    // Day is considered between 6 AM and 6 PM (18:00)
    const isNight = localHour >= 18 || localHour < 6;

    let baseWeather = 'Sunny';

    if (conditionId >= 200 && conditionId < 300) baseWeather = 'Storm'; // Thunderstorm
    else if (conditionId >= 300 && conditionId < 600) baseWeather = 'Rain'; // Drizzle / Rain
    else if (conditionId >= 600 && conditionId < 700) baseWeather = 'Rain'; // Snow 
    else if (conditionId >= 803 && conditionId <= 804) baseWeather = 'Cloudy'; // Overcast
    else if (windSpeed > 10) baseWeather = 'Wind';

    if (isNight) {
        if (baseWeather === 'Sunny') return 'Night'; // Clear/Few clouds at night -> starry
        return baseWeather + 'Night'; // e.g. RainNight, CloudyNight
    } else {
        return baseWeather; // e.g. Sunny, Rain, Cloudy
    }
};

export const WeatherProvider = ({ children }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentCity, setCurrentCity] = useState('');
    const [weatherTheme, setWeatherTheme] = useState('Sunny');
    const [prevTheme, setPrevTheme] = useState('Sunny');
    const [transitioning, setTransitioning] = useState(false);
    const [performanceMode, setPerformanceMode] = useState(false);
    const [unit, setUnit] = useState('C'); // C or F

    const togglePerformanceMode = () => setPerformanceMode(prev => !prev);
    const toggleUnit = () => setUnit(prev => prev === 'C' ? 'F' : 'C');

    const applyTheme = useCallback((newTheme) => {
        if (newTheme === weatherTheme) return;
        setPrevTheme(weatherTheme);
        setWeatherTheme(newTheme);
        setTransitioning(true);
        // Allow the SceneManager to crossfade for 1.5s
        setTimeout(() => {
            setTransitioning(false);
        }, 1500);
    }, [weatherTheme]);

    const fetchWeather = useCallback(async (city) => {
        setLoading(true);
        setError(null);
        try {
            console.log(`Fetching weather for: ${city}`);
            // Use the deployed backend URL instead of localhost
            const response = await axios.get(`https://weather-back-git-main-aanjaney71s-projects.vercel.app/api/v1/weather/${encodeURIComponent(city)}?fresh=true`);
            console.log("Weather API Response:", response.data.current.weather[0], "Timezone:", response.data.current.timezone);
            setWeatherData(response.data);
            setCurrentCity(city);
            const newTheme = getThemeFromData(response.data.current);
            console.log("Calculated Theme:", newTheme);
            applyTheme(newTheme);
        } catch (err) {
            console.error("Weather Fetch Error:", err);
            setError(err.response?.data?.error || 'City not found. Please try another.');
        } finally {
            setLoading(false);
        }
    }, [applyTheme]);

    // Auto-fetch Bhopal on first load
    useEffect(() => {
        fetchWeather('Bhopal');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getGeoLocation = () => {
        if (!('geolocation' in navigator)) {
            setError('Geolocation not supported');
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                try {
                    const apiKey = import.meta.env.VITE_OWM_API_KEY;
                    const { data } = await axios.get(
                        `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
                    );
                    if (data.length > 0) fetchWeather(data[0].name);
                    else { setError('Could not resolve your location.'); setLoading(false); }
                } catch { setError('Failed to resolve location'); setLoading(false); }
            },
            (err) => { setError(err.message); setLoading(false); }
        );
    };

    return (
        <WeatherContext.Provider value={{
            weatherData,
            loading,
            error,
            currentCity,
            weatherTheme,
            prevTheme,
            transitioning,
            performanceMode,
            unit,
            toggleUnit,
            togglePerformanceMode,
            fetchWeather,
            getGeoLocation
        }}>
            {children}
        </WeatherContext.Provider>
    );
};
