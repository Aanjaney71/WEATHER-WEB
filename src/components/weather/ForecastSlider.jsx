import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import GlassCard from '../ui/GlassCard';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const ForecastSlider = () => {
    const { weatherData } = useWeather();
    if (!weatherData) return null;

    const { forecast } = weatherData;
    // OWM forecast API returns 3-hour intervals, total 40 records for 5 days.
    // We'll take the first 8 records (next 24 hours) for the graph
    const next24Hours = forecast.list.slice(0, 8);

    const labels = next24Hours.map(item => {
        const time = new Date(item.dt * 1000);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    const temps = next24Hours.map(item => Math.round(item.main.temp));

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Temperature (°C)',
                data: temps,
                borderColor: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: 'rgba(255,255,255,0.5)',
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeInOutQuart' },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.5)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                displayColors: false,
                callbacks: { label: (ctx) => `${ctx.parsed.y}°` }
            }
        },
        scales: {
            y: {
                display: false,
                beginAtZero: false,
                grid: { display: false },
            },
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { color: 'rgba(255,255,255,0.65)', font: { size: 11 } },
                border: { display: false },
            }
        },
        interaction: { intersect: false, mode: 'index' },
    };

    return (
        <GlassCard className="h-full flex flex-col min-h-[300px] w-full overflow-hidden">
            <h3 className="text-xl font-medium mb-6 text-white/90">24-Hour Forecast</h3>
            <div className="flex-1 w-full min-h-[200px] relative">
                <Line options={options} data={data} />
            </div>

            <div className="flex justify-between items-center mt-6 overflow-x-auto pb-4 gap-4 no-scrollbar relative w-full">
                {next24Hours.map((item, i) => (
                    <div key={i} className="flex flex-col items-center justify-center min-w-[60px]">
                        <span className="text-xs text-white/60 mb-2">
                            {new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric' })}
                        </span>
                        <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                            alt="weather"
                            className="w-8 h-8 opacity-80"
                        />
                        <span className="text-sm font-semibold mt-1">{Math.round(item.main.temp)}°</span>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};

export default ForecastSlider;
