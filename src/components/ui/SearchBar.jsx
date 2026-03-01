import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const { fetchWeather, getGeoLocation } = useWeather();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            fetchWeather(query);
            setQuery('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto mb-8 z-10">
            <div className="relative flex items-center w-full h-14 rounded-full focus-within:shadow-lg bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden transition-all duration-300">
                <div className="grid place-items-center h-full w-12 text-white/70">
                    <Search size={20} />
                </div>

                <input
                    className="peer h-full w-full outline-none text-sm text-white bg-transparent pr-2 placeholder-white/60"
                    type="text"
                    id="search"
                    placeholder="Search for a city..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <button
                    type="button"
                    onClick={getGeoLocation}
                    className="grid place-items-center h-full w-12 text-white/70 hover:text-white transition-colors cursor-pointer border-l border-white/10"
                    title="Use current location"
                >
                    <MapPin size={20} />
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
