import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global handlers — prevent minor network/async errors from surfacing as uncaught crashes
window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  if (!event.message || event.message === 'Script error.') return;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
