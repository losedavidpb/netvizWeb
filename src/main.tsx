// React core and DOM rendering utilities
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// CSS styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'

// Main program
import App from './App.tsx'

// Renders the React application into HTML
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);