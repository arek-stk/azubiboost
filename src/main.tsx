import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { App } from './App'
import './styles/tokens.css'
import './styles/base.css'
import './styles/ui.css'
import './styles/lernen.css'
import './styles/zettel.css'
import './styles/design.css'

// Service Worker: macht die App offline nutzbar und holt Updates still im Hintergrund.
registerSW({ immediate: true })

const root = document.getElementById('root')
if (root === null) throw new Error('#root fehlt in index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
