// ============================================================
// FICHIER : src/components/AjouterProjet.jsx
// RÔLE    : Formulaire pour ajouter un nouveau projet.
//           Gère les champs avec useState (controlled inputs).
//           Envoie une requête POST vers json-server.
//           Redirige vers "/" après succès.
//
// CONCEPT CLÉ — Controlled Component :
//   En HTML pur, les inputs gèrent leur propre valeur.
//   En React, on contrôle NOUS-MÊMES la valeur via le state.
//   Flux : frappe → onChange → setState → input affiche la valeur
// ============================================================

import { useState } from 'react'

// useNavigate = hook pour naviguer par programme
// Équivalent de window.location.href = "..." en JS pur
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:3000/projets'

function AjouterProjet() {

  // ── STATE — un état par champ du formulaire ───────────────
  /*
    Valeur initiale = '' (chaîne vide).
    À chaque frappe, onChange met à jour le state correspondant.
    React re-rend le composant → l'input affiche la nouvelle valeur.
  */
  const [libelle,      setLibelle]      = useState('')
  const [description,  setDescription]  = useState('')
  const [technologies, setTechnologies] = useState('')
  const [image,        setImage]        = useState('')
  const [envoi,        setEnvoi]        = useState(false) // désactive le bouton pendant l'envoi
  const [erreur,       setErreur]       = useState(null)

  const navigate = useNavigate()


  // ── SOUMISSION DU FORMULAIRE ──────────────────────────────
  const handleSubmit = async (e) => {
    /*
      e.preventDefault() = ANNULE le comportement HTML par défaut.
      Sans ça → la page se rechargerait (rechargement HTTP classique).
      Avec ça → on garde le contrôle dans JavaScript.
    */
    e.preventDefault()
    setEnvoi(true)
    setErreur(null)

    /*
      On convertit technologies (string "HTML, CSS, JS")
      en tableau ["HTML", "CSS", "JS"] via .split() + .map()
      pour être cohérent avec la structure de tes données.
    */
    const technosTableau = technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '')

    // Objet à envoyer à json-server
    const nouveauProjet = {
      libelle,
      description,
      technologies: technosTableau,
      image,
      date: new Date().toISOString().slice(0, 10) // "2025-04-19"
    }

    try {
      const reponse = await fetch(API_URL, {
        method: 'POST',
        // Content-Type indique à json-server qu'on envoie du JSON
        headers: { 'Content-Type': 'application/json' },
        // JSON.stringify convertit l'objet JS en chaîne JSON
        body: JSON.stringify(nouveauProjet)
      })

      if (!reponse.ok) throw new Error('Erreur serveur : ' + reponse.status)

      /*
        navigate('/') = redirige vers la liste après succès.
        Équivalent de window.location.href = "lister-projets.html"
        mais sans rechargement — React Router gère la navigation.
      */
      navigate('/')

    } catch (err) {
      console.error('Erreur ajout :', err)
      setErreur('Impossible d\'ajouter le projet. Vérifiez que json-server est lancé sur le port 3000.')
      setEnvoi(false)
    }
  }


  // ── RENDU ─────────────────────────────────────────────────
  return (
    <div className="pt-10 pb-16 px-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Ajouter un nouveau projet
        </h1>

        {/* Message d'erreur */}
        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700
                          rounded-xl p-4 mb-6 text-sm">
            {erreur}
          </div>
        )}

        {/*
          onSubmit={handleSubmit} = appelle notre fonction à la soumission.
          React intercepte l'événement AVANT le comportement HTML.
        */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── CHAMP LIBELLÉ ─────────────────────────────── */}
          <div>
            <label
              htmlFor="libelle"
              className="block font-medium text-gray-700 mb-1"
            >
              Libellé du projet *
            </label>
            {/*
              value={libelle}              → lie l'input au state
              onChange={e => setLibelle(e.target.value)} → met à jour le state à chaque frappe
              e.target.value = la valeur actuelle de l'input

              NOTE JSX : htmlFor (pas "for") — "for" est réservé en JavaScript
            */}
            <input
              type="text"
              id="libelle"
              value={libelle}
              onChange={e => setLibelle(e.target.value)}
              placeholder="Ex : Portfolio Web"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* ── CHAMP DESCRIPTION ─────────────────────────── */}
          <div>
            <label
              htmlFor="description"
              className="block font-medium text-gray-700 mb-1"
            >
              Description *
            </label>
            {/* textarea en JSX : même logique value + onChange */}
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Décris ton projet, ses objectifs..."
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y"
            />
          </div>

          {/* ── CHAMP TECHNOLOGIES ────────────────────────── */}
          <div>
            <label
              htmlFor="technologies"
              className="block font-medium text-gray-700 mb-1"
            >
              Technologies <span className="text-gray-400 font-normal">(séparées par des virgules)</span>
            </label>
            <input
              type="text"
              id="technologies"
              value={technologies}
              onChange={e => setTechnologies(e.target.value)}
              placeholder="HTML, CSS, JavaScript, React"
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {/* Aperçu en temps réel des badges technos */}
            {technologies && (
              <div className="flex flex-wrap gap-2 mt-2">
                {technologies.split(',').map((t, i) => t.trim() && (
                  <span key={i}
                    className="bg-blue-50 text-blue-700 text-xs
                               font-medium px-2 py-1 rounded-full">
                    {t.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── CHAMP IMAGE ───────────────────────────────── */}
          <div>
            <label
              htmlFor="image"
              className="block font-medium text-gray-700 mb-1"
            >
              URL de l'image *
            </label>
            <input
              type="url"
              id="image"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://..."
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {/* Aperçu de l'image en temps réel */}
            {image && (
              <img
                src={image}
                alt="Aperçu"
                className="mt-3 w-full h-40 object-cover rounded-lg border border-gray-200"
                onError={e => e.target.style.display = 'none'}
              />
            )}
          </div>

          {/* ── BOUTONS ───────────────────────────────────── */}
          <div className="flex gap-3 pt-2">
            {/*
              type="submit" → déclenche onSubmit du formulaire.
              disabled={envoi} → désactive pendant l'envoi (évite double clic).
            */}
            <button
              type="submit"
              disabled={envoi}
              className="flex-1 bg-blue-600 text-white font-bold py-3
                         rounded-lg hover:bg-blue-700 transition shadow-md
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {envoi ? 'Envoi en cours...' : '➕ Ajouter le projet'}
            </button>

            {/*
              type="button" → NE soumet PAS le formulaire.
              onClick → navigate('/') = retour à la liste.
            */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 border border-gray-300 text-gray-600 font-medium
                         py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Annuler
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AjouterProjet