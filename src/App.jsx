import { motion, AnimatePresence } from 'framer-motion'
import { WeatherProvider, useWeather } from './context/WeatherContext'
import SearchBar from './components/ui/SearchBar'
import CurrentWeather from './components/weather/CurrentWeather'
import ForecastSlider from './components/weather/ForecastSlider'
import ImageBackground from './components/weather/ImageBackground'

function AppContent() {
  const { currentCity, weatherTheme } = useWeather()

  console.log("AppContent Render -> currentCity:", currentCity, "| weatherTheme:", weatherTheme);

  return (
    <>
      {/* Background Layer: 2D Image Implementation */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <ImageBackground theme={weatherTheme} />
      </div>

      {/* UI content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '24px 24px 32px',
      }}>

        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textShadow: '0 2px 40px rgba(0,0,0,0.7)',
            margin: 0,
            lineHeight: 1.1,
          }}>
            Atmos<span style={{ color: '#38bdf8' }}>Sphere</span>
          </h1>
          <p style={{
            marginTop: '6px',
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
          }}>
            Global Weather Simulation
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          style={{ width: '100%', maxWidth: '520px', marginBottom: '24px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <SearchBar />
        </motion.div>

        {/* Weather cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCity}
            className="w-full max-w-[1100px] flex flex-col md:grid md:grid-cols-[340px_1fr] gap-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <CurrentWeather />
            <ForecastSlider />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

function App() {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  )
}

export default App

