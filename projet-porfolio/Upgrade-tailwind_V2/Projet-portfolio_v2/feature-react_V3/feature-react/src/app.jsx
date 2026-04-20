// App.jsx = composant RACINE de l'application
// Il définit :
//   1. La navigation (Header avec les liens)
//   2. Le routage (quelle page afficher selon l'URL)

// Routes, Route = système de routage de React Router
// Link = remplace <a href="..."> → ne recharge PAS la page (SPA)
import { Routes, Route, Link, useLocation } from 'react-router-dom'

// On importe les pages (pas encore créées — on les fera bloc par bloc)
// Pour l'instant on met des placeholders
// import Dossier from './components/Dossier'
// import AjouterProjet from './components/AjouterProjet'
// import DetaillerProjet from './components/DetaillerProjet'

import Dossier from './components/Dossier'
import AjouterProjet from './components/AjouterProjet'
const DetaillerProjet = () => <div className="p-8 text-center text-gray-400">DetaillerProjet — Bloc 6</div>



// ── COMPOSANT HEADER ────────────────────────────────────────
// Séparé dans App.jsx pour l'instant (sera dans Header.jsx si besoin)
function Header() {
  // useLocation() = donne l'URL actuelle
  // Permet d'appliquer un style "actif" sur le bon lien
  const location = useLocation()

  // Fonction utilitaire : retourne les classes du lien nav
  // selon si le chemin correspond à l'URL actuelle
  const navClass = (path) => {
    const base = "font-medium transition-colors duration-200"
    const actif = "text-blue-600 border-b-2 border-blue-600 pb-1"
    const inactif = "text-gray-700 hover:text-blue-600"
    return `${base} ${location.pathname === path ? actif : inactif}`
  }

  return (
    // sticky top-0 = collé en haut au scroll
    // z-50 = passe au-dessus de tout
    // backdrop-blur = léger flou derrière la nav 
    <nav className="sticky top-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo/nom — Link vers "/" ne recharge pas la page */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Abdoukarim Sy
        </Link>

        {/* Liens de navigation */}
        <div className="flex items-center gap-6">

          {/* Link to="/" = page liste des projets */}
          <Link to="/" className={navClass("/")}>
            Mes projets
          </Link>

          {/* Link to="/ajouter" = page formulaire */}
          <Link
            to="/ajouter"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Ajouter
          </Link>

        </div>
      </div>
    </nav>
  )
}


// ── COMPOSANT APP (racine) ───────────────────────────────────
function App() {
  return (
    // Fragment <> = enveloppe sans div inutile dans le DOM
    <>
      {/* Header affiché sur TOUTES les pages */}
      <Header />

      {/* Zone de contenu principale */}
      <main className="min-h-screen bg-gray-50">

        {/*
          Routes = conteneur qui écoute l'URL
          Route = règle : si URL = path → affiche element

          Nos 3 routes :
          /           → liste des projets (Dossier)
          /ajouter    → formulaire d'ajout
          /projet/:id → détail d'un projet (:id = paramètre dynamique)
        */}
        <Routes>
          <Route path="/"           element={<Dossier />} />
          <Route path="/ajouter"    element={<AjouterProjet />} />
          <Route path="/projet/:id" element={<DetaillerProjet />} />
        </Routes>

      </main>

      {/* Footer commun à toutes les pages */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-sm">
        <p>© 2025 Abdoukarim Sy — Portfolio React JS</p>
      </footer>
    </>
  )
}

export default App