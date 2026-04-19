// ============================================================
// FICHIER : src/components/Dossier.jsx
// RÔLE    : Page principale — liste tous les projets.
//           Gère le STATE (liste des projets).
//           Charge les données depuis json-server au démarrage.
//           Gère la suppression d'un projet.
//
// CONCEPTS utilisés :
//   - useState  : stocker la liste des projets en mémoire
//   - useEffect : charger les données au montage du composant
//   - fetch     : requêtes HTTP vers json-server
// ============================================================

// useState  = déclare un état local (données qui peuvent changer)
// useEffect = exécute du code APRÈS le rendu (ex: appel API)
import { useState, useEffect } from 'react'

// On importe le composant Projet pour afficher chaque carte
import Projet from './Projet'

// URL de l'API json-server
const API_URL = 'http://localhost:3000/projets'

function Dossier() {

  // ── STATE ──────────────────────────────────────────────────
  /*
    useState([]) = déclare "projets" avec [] comme valeur initiale.
    projets    = la valeur actuelle (tableau d'objets)
    setProjets = fonction pour modifier projets

    RÈGLE : ne JAMAIS modifier projets directement.
    **-- projets.push(...)        → React ne voit pas le changement
    **-- setProjets([...projets]) → React re-rend le composant
  */
  const [projets, setProjets]       = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur]         = useState(null)


  // ── CHARGEMENT AU DÉMARRAGE ────────────────────────────────
  /*
    useEffect(fonction, [])
    [] = tableau de dépendances VIDE
    → la fonction s'exécute UNE SEULE FOIS au montage du composant
    → équivalent du document.addEventListener("DOMContentLoaded", ...)
       de ta phase 3
  */
  useEffect(() => {
    chargerProjets()
  }, []) // [] = une seule fois au montage


  // ── FONCTION : charger depuis l'API ───────────────────────
  const chargerProjets = async () => {
    try {
      setChargement(true)
      setErreur(null)

      const reponse = await fetch(API_URL)

      // Vérifie que la requête a réussi (status 200-299)
      if (!reponse.ok) throw new Error('Erreur réseau : ' + reponse.status)

      const data = await reponse.json()

      // Met à jour le state → React re-rend automatiquement
      setProjets(data)

    } catch (err) {
      console.error('Erreur chargement :', err)
      setErreur('Impossible de charger les projets. Vérifiez que json-server est lancé sur le port 3000.')
    } finally {
      // finally = exécuté dans tous les cas (succès ou erreur)
      setChargement(false)
    }
  }


  // ── FONCTION : supprimer un projet ────────────────────────
  const supprimerProjet = async (id) => {
    if (!window.confirm('Supprimer ce projet ? Action irréversible.')) return

    try {
      // Requête DELETE vers json-server
      const reponse = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!reponse.ok) throw new Error('Erreur suppression')

      /*
        Mise à jour IMMUTABILE du state.
        On crée un NOUVEAU tableau sans le projet supprimé.
        .filter() retourne tous les projets SAUF celui avec cet id.

        **--projets.splice(...)  → mutation directe, React ne voit rien
        **--setProjets(projets.filter(...)) → nouveau tableau → React re-rend
      */
      setProjets(projets.filter(p => p.id !== id))

    } catch (err) {
      console.error('Erreur suppression :', err)
      alert('Erreur lors de la suppression.')
    }
  }


  // ── RENDU ─────────────────────────────────────────────────
  return (
    <div className="pt-10 pb-16 px-4 max-w-6xl mx-auto">

      {/* Titre de la page */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-3">
        Mes réalisations
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Découvrez mes projets personnels et académiques
      </p>

      {/* ── ÉTAT : CHARGEMENT ─────────────────────────────── */}
      {/*
        Affichage conditionnel en React : {condition && <JSX>}
        Si chargement est true → affiche le spinner
      */}
      {chargement && (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-blue-600
                          border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Chargement des projets...</p>
        </div>
      )}

      {/* ── ÉTAT : ERREUR ─────────────────────────────────── */}
      {erreur && (
        <div className="bg-red-50 border border-red-200 text-red-700
                        rounded-xl p-6 text-center max-w-lg mx-auto">
          <p className="font-semibold mb-2">Erreur de connexion</p>
          <p className="text-sm">{erreur}</p>
          <button
            onClick={chargerProjets}
            className="mt-4 px-4 py-2 bg-red-600 text-white
                       rounded-lg hover:bg-red-700 transition text-sm"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ── ÉTAT : LISTE VIDE ─────────────────────────────── */}
      {!chargement && !erreur && projets.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">exp</p>
          <p className="text-lg font-medium">Aucun projet pour l'instant</p>
          <p className="text-sm mt-2">Clique sur "+ Ajouter" pour créer ton premier projet</p>
        </div>
      )}

      {/* ── ÉTAT : LISTE DES PROJETS ──────────────────────── */}
      {/*
        .map() = transforme chaque objet projet en composant <Projet>.
        key={p.id} = obligatoire pour React (optimisation du DOM virtuel).
        projet={p} = passe l'objet projet comme prop.
        onSupprimer={supprimerProjet} = passe la fonction comme prop.
      */}
      {!chargement && !erreur && projets.length > 0 && (
        <>
          {/* Compteur */}
          <p className="text-sm text-gray-400 text-right mb-6">
            {projets.length} projet{projets.length > 1 ? 's' : ''}
          </p>

          {/* Grille responsive (même layout que ta phase 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projets.map(p => (
              <Projet
                key={p.id}
                projet={p}
                onSupprimer={supprimerProjet}
              />
            ))}
          </div>
        </>
      )}

    </div>
  )
}

export default Dossier