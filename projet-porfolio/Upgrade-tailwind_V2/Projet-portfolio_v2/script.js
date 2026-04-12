// script.js
const API_URL = "http://localhost:3000/projets";
let projets = [];

async function chargerProjets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erreur réseau");
        projets = await response.json();
        afficherGrille();
    } catch (error) {
        console.error("Erreur chargement :", error);
        alert("Impossible de charger les projets. Vérifiez que json-server est lancé (npx json-server --watch db.json --port 3000)");
    }
}

function afficherGrille() {
    const grille = document.getElementById("grille-projets");
    if (!grille) return;
    grille.innerHTML = ""; // on vide la grille

    projets.forEach(projet => {
        const carte = creerCarteProjet(projet);
        grille.appendChild(carte);
    });
}
