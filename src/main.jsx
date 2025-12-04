import { ParallaxProvider } from 'react-scroll-parallax';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ParallaxProvider>
    <App />
  </ParallaxProvider>,
);
