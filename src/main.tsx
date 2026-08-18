import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GlobalErrorBoundary } from '@/components/ui/GlobalErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
)

// Register Service Worker (production only, HTTPS only)
// Shell-only caching — lesson content is NEVER cached (Supabase RLS boundary)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.info('[SW] Registered, scope:', reg.scope)
      })
      .catch((err) => {
        console.warn('[SW] Registration failed:', err)
      })
  })
}
