import { createRoot } from 'react-dom/client'
import { Chart as ChartJS, defaults } from 'chart.js'
import './index.css'
import App from './App.jsx'

// Make ALL Chart.js canvases render with transparent background
defaults.backgroundColor = 'transparent';
defaults.color = 'rgba(255,255,255,0.75)';


// Removed StrictMode - it can cause double-invocation issues with Three.js WebGL contexts
createRoot(document.getElementById('root')).render(<App />)
