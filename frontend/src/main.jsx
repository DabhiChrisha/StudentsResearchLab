import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global handlers — prevent minor network/async errors from surfacing as uncaught crashes
window.addEventListener('unhandledrejection', (event) => {
  console.error('[SRL] Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Stops "Uncaught (in promise)" browser error
});

window.addEventListener('error', (event) => {
  // Ignore cross-origin script errors (third-party) — they have no useful info
  if (!event.message || event.message === 'Script error.') return;
  console.error('[SRL] Global error:', event.error ?? event.message);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
