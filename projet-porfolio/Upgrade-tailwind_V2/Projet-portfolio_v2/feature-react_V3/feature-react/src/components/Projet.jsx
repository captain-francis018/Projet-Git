// ============================================================
// FICHIER : src/components/Projet.jsx
// RÔLE    : Affiche la CARTE d'un seul projet dans la liste.
//           Reçoit les données via PROPS depuis Dossier.jsx.
//
// PROPS reçues :
//   - projet     : objet { id, libelle, description, image, technologies }
//   - onSupprimer : fonction à appeler quand on clique "Supprimer"
// ============================================================

// Link = navigation SPA vers la page détail (pas de rechargement)
import { Link } from 'react-router-dom'

function Projet({ projet, onSupprimer }) {
  return (
    // article = élément sémantique pour un contenu autonome
    // hover-grow = animation de scale au survol (comme ta phase 3)
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden
                        transition-transform duration-200 hover:scale-105">

      {/* ── IMAGE ─────────────────────────────────────────── */}
      <img
        src={projet.image}
        alt={projet.libelle}
        className="w-full h-56 object-cover"
        // Si l'image ne charge pas → image placeholder
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x200?text=Image+manquante'
        }}
      />

      {/* ── CONTENU ───────────────────────────────────────── */}
      <div className="p-5 flex flex-col gap-3">

        {/*
          Le libellé est un LIEN vers la page détail.
          Link to={`/projet/${projet.id}`} = navigation React Router.
          Équivalent de <a href="detailler-projet.html?id=..."> en HTML pur
          mais SANS rechargement de page.
        */}
        <Link
          to={`/projet/${projet.id}`}
          className="text-xl font-bold text-blue-600 hover:underline"
        >
          {projet.libelle}
        </Link>

        {/* Description courte */}
        <p className="text-gray-500 text-sm line-clamp-2">
          {projet.description}
        </p>

        {/* Technologies sous forme de badges */}
        {projet.technologies && (
          <div className="flex flex-wrap gap-2">
            {/*
              projet.technologies peut être :
              - un string "HTML,CSS,JS" → on fait .split(",")
              - un tableau ["HTML","CSS"] → on utilise directement
            */}
            {(Array.isArray(projet.technologies)
              ? projet.technologies
              : projet.technologies.split(',')
            ).map((tech, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 text-xs
                           font-medium px-2 py-1 rounded-full"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        )}

        {/* ── BOUTONS ─────────────────────────────────────── */}
        <div className="flex gap-3 mt-2">

          {/* Voir détail = même chose que cliquer sur le titre */}
          <Link
            to={`/projet/${projet.id}`}
            className="flex-1 text-center px-3 py-2 bg-blue-600
                       text-white rounded-lg text-sm font-medium
                       hover:bg-blue-700 transition"
          >
            Voir détails
          </Link>

          {/*
            Bouton Supprimer.
            onClick appelle onSupprimer (prop reçue de Dossier.jsx)
            en passant l'id du projet.

            () => onSupprimer(projet.id) = arrow function wrapper.
            Sans le wrapper, la fonction s'exécuterait
            IMMÉDIATEMENT au rendu au lieu d'attendre le clic.
          */}
          <button
            onClick={() => onSupprimer(projet.id)}
            className="flex-1 px-3 py-2 border border-red-500
                       text-red-500 rounded-lg text-sm font-medium
                       hover:bg-red-500 hover:text-white transition"
          >
            Supprimer
          </button>

        </div>
      </div>
    </article>
  )
}

export default Projet