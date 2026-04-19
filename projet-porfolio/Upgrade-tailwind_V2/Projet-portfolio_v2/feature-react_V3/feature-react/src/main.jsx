// main.jsx = point d'entrée de l'application React
// C'est le PREMIER fichier exécuté par Vite
// Il "monte" (attache) App dans le div#root de index.html

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// BrowserRouter active le système de routage (navigation SPA)
// Il DOIT envelopper toute l'application
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'

// createRoot cible le div#root dans index.html
// .render() injecte l'application React dedans
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter doit être le plus haut possible dans l'arbre */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)