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

function creerCarteProjet(projet) {
    const article = document.createElement("article");
    article.id = `projet-${projet.id}`;
    article.className = "bg-white rounded-lg shadow overflow-hidden";
    article.innerHTML = `
        <img src="${projet.image}" alt="${projet.libelle}" class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="text-xl font-bold">${projet.libelle}</h3>
            <p class="text-gray-600 mt-2 font-bold">${projet.description}</p>
            <h4 class="font-semibold mt-3">Technologies utilisées</h4>
            <ul class="list-disc list-inside">
                ${projet.technologies.split(",").map(t => `<li>${t.trim()}</li>`).join("")}
            </ul>
            <div class="flex gap-2 mt-4">
                <button onclick="detaillerProjet(${projet.id})" class="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Voir détails</button>
                <button onclick="supprimerProjet(${projet.id})" class="px-3 py-1 border border-red-500 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white">Supprimer</button>
            </div>
        </div>
    `;
    return article;
}

document.addEventListener("DOMContentLoaded", chargerProjets);