// ============================================================
// 📋 routes/tasks.js — Toutes les routes de l'API des tâches
// ============================================================
// Ce fichier contient les 6 endpoints (points d'accès) de notre API.
// Chaque endpoint correspond à une action : lire, créer, modifier, supprimer.
// C'est ici que toute la "logique métier" de notre API se passe.
// ============================================================

// --- 1. IMPORTATION DES MODULES ---

// 'express' est notre framework web.
// On importe spécifiquement le 'Router' qui permet d'organiser les routes
// dans des fichiers séparés (au lieu de tout mettre dans server.js).
const express = require('express');

// express.Router() crée un mini-routeur indépendant.
// On peut y attacher des routes et ensuite le connecter à l'app principale.
// C'est comme créer un "groupe de routes" réutilisable.
const router = express.Router();

// 'fs' (File System) est un module intégré de Node.js.
// Il permet de lire et écrire des fichiers sur le disque dur.
// On l'utilise ici pour lire/écrire notre "base de données" JSON.
const fs = require('fs');

// 'path' aide à construire des chemins de fichiers fiables.
// path.join() combine des morceaux de chemin en respectant l'OS.
const path = require('path');

// 'uuid' génère des identifiants uniques (ex: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d").
// On l'utilise pour donner un ID unique à chaque nouvelle tâche.
// { v4: uuidv4 } signifie qu'on importe la fonction 'v4' et on la renomme 'uuidv4'.
const { v4: uuidv4 } = require('uuid');

// --- 2. CHEMIN VERS LE FICHIER DE DONNÉES ---

// __dirname est une variable spéciale de Node.js qui contient le chemin
// du dossier où se trouve CE fichier (routes/).
// path.join() remonte d'un dossier (..) puis va dans data/tasks.json.
// Résultat : le chemin complet vers notre fichier de données.
const cheminFichier = path.join(__dirname, '..', 'data', 'tasks.json');

// --- 3. FONCTIONS UTILITAIRES ---

// Cette fonction lit le fichier JSON et retourne les tâches sous forme de tableau.
// On l'utilise dans chaque endpoint pour accéder aux données.
function lireTaches() {
    // fs.readFileSync() lit le fichier de manière synchrone (attend la fin de la lecture).
    // 'utf-8' indique l'encodage du fichier (pour lire les accents correctement).
    const donnees = fs.readFileSync(cheminFichier, 'utf-8');

    // JSON.parse() transforme le texte JSON en objet/tableau JavaScript.
    // Le fichier contient du texte comme '[{"id":"1",...}]',
    // et JSON.parse le transforme en vrai tableau JavaScript qu'on peut manipuler.
    return JSON.parse(donnees);
}

// Cette fonction sauvegarde le tableau de tâches dans le fichier JSON.
// On l'appelle après chaque modification (ajout, modification, suppression).
function sauvegarderTaches(taches) {
    // JSON.stringify() fait l'inverse de JSON.parse() :
    // il transforme un objet/tableau JavaScript en texte JSON.
    // Le 'null' et le '2' sont pour le formatage :
    //   - null = pas de filtre sur les propriétés
    //   - 2 = indentation de 2 espaces (pour que le fichier soit lisible)
    const donnees = JSON.stringify(taches, null, 2);

    // fs.writeFileSync() écrit les données dans le fichier.
    // Si le fichier existe déjà, il est écrasé (remplacé).
    fs.writeFileSync(cheminFichier, donnees, 'utf-8');
}

// ============================================================
// 📌 ENDPOINT 1 : GET / — Récupérer TOUTES les tâches
// ============================================================
// URL complète : GET http://localhost:3000/api/taches
// But : Retourner la liste de toutes les tâches.
// C'est l'endpoint le plus simple : on lit et on renvoie.
// ============================================================
router.get('/', (req, res) => {
    // On lit toutes les tâches depuis le fichier JSON.
    const taches = lireTaches();

    // --- BONUS : Filtrage par statut (fait/pas fait) ---
    // req.query contient les paramètres de l'URL après le '?'.
    // Exemple : /api/taches?fait=true → req.query.fait vaut "true" (en texte).
    // Cela permet de filtrer les tâches sans créer un nouvel endpoint.
    const { fait, priorite } = req.query;

    // On commence avec toutes les tâches.
    let resultat = taches;

    // Si le paramètre 'fait' est présent dans l'URL, on filtre.
    if (fait !== undefined) {
        // fait === 'true' compare la chaîne de caractères (car les query params sont toujours des textes).
        // .filter() crée un nouveau tableau avec seulement les éléments qui passent le test.
        resultat = resultat.filter(tache => tache.fait === (fait === 'true'));
    }

    // Si le paramètre 'priorite' est présent, on filtre aussi par priorité.
    if (priorite !== undefined) {
        resultat = resultat.filter(tache => tache.priorite === priorite);
    }

    // On renvoie le résultat en JSON avec un code 200 (OK = succès).
    // Le code 200 est le code par défaut, mais on l'écrit explicitement pour apprendre.
    res.status(200).json({
        succes: true,
        total: resultat.length,
        donnees: resultat
    });
});

// ============================================================
// 📌 ENDPOINT 2 : GET /:id — Récupérer UNE tâche par son ID
// ============================================================
// URL complète : GET http://localhost:3000/api/taches/1
// But : Trouver et retourner une tâche spécifique.
// ':id' est un paramètre dynamique — il change selon la requête.
// ============================================================
router.get('/:id', (req, res) => {
    // req.params contient les paramètres de l'URL définis avec ':'.
    // Si l'URL est /api/taches/abc123, alors req.params.id vaut "abc123".
    const { id } = req.params;

    // On lit toutes les tâches.
    const taches = lireTaches();

    // .find() cherche le premier élément du tableau qui correspond à la condition.
    // Il retourne l'élément trouvé, ou 'undefined' si rien n'est trouvé.
    const tache = taches.find(t => t.id === id);

    // Si la tâche n'existe pas (find a retourné undefined), on renvoie une erreur 404.
    if (!tache) {
        // 404 = Not Found (non trouvé). Le client a demandé quelque chose qui n'existe pas.
        return res.status(404).json({
            succes: false,
            erreur: `❌ Tâche avec l'ID "${id}" non trouvée.`
        });
    }

    // Si la tâche existe, on la renvoie avec un code 200 (succès).
    res.status(200).json({
        succes: true,
        donnees: tache
    });
});

// ============================================================
// 📌 ENDPOINT 3 : POST / — Créer une NOUVELLE tâche
// ============================================================
// URL complète : POST http://localhost:3000/api/taches
// But : Ajouter une nouvelle tâche à notre liste.
// POST est la méthode HTTP utilisée pour CRÉER des ressources.
// Le client envoie les données de la tâche dans le corps (body) de la requête.
// ============================================================
router.post('/', (req, res) => {
    // req.body contient les données envoyées par le client au format JSON.
    // Le middleware express.json() (dans server.js) a déjà transformé le texte en objet.
    // On utilise la déstructuration pour extraire les propriétés qu'on attend.
    const { titre, description, priorite } = req.body;

    // --- VALIDATION DES DONNÉES ---
    // Avant de créer la tâche, on vérifie que les données obligatoires sont présentes.
    // C'est une bonne pratique : ne jamais faire confiance aux données du client !
    if (!titre) {
        // 400 = Bad Request (mauvaise requête). Le client a envoyé des données incorrectes.
        return res.status(400).json({
            succes: false,
            erreur: '❌ Le champ "titre" est obligatoire.',
            exemple: {
                titre: 'Ma nouvelle tâche',
                description: 'Description optionnelle',
                priorite: 'haute | moyenne | basse'
            }
        });
    }

    // On lit les tâches existantes.
    const taches = lireTaches();

    // On crée un nouvel objet tâche avec toutes les propriétés nécessaires.
    const nouvelleTache = {
        // uuidv4() génère un identifiant unique aléatoire.
        // Exemple : "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
        id: uuidv4(),

        // Le titre envoyé par le client (obligatoire, vérifié ci-dessus).
        titre: titre,

        // La description envoyée par le client.
        // '|| ""' signifie : si description est undefined/null, utiliser une chaîne vide.
        // C'est une valeur par défaut.
        description: description || '',

        // Par défaut, une nouvelle tâche n'est pas encore faite.
        fait: false,

        // La priorité envoyée par le client, ou 'moyenne' par défaut.
        priorite: priorite || 'moyenne',

        // new Date().toISOString() crée la date et l'heure actuelles au format international.
        // Exemple : "2026-02-24T23:30:00.000Z"
        creeLe: new Date().toISOString()
    };

    // .push() ajoute la nouvelle tâche à la fin du tableau.
    taches.push(nouvelleTache);

    // On sauvegarde le tableau mis à jour dans le fichier JSON.
    sauvegarderTaches(taches);

    // On renvoie la tâche créée avec un code 201 (Created = créé avec succès).
    // 201 est plus précis que 200 : il indique qu'une nouvelle ressource a été créée.
    res.status(201).json({
        succes: true,
        message: '✅ Tâche créée avec succès !',
        donnees: nouvelleTache
    });
});

// ============================================================
// 📌 ENDPOINT 4 : PUT /:id — Modifier une tâche COMPLÈTE
// ============================================================
// URL complète : PUT http://localhost:3000/api/taches/1
// But : Remplacer toutes les données d'une tâche existante.
// PUT est la méthode HTTP pour une mise à jour COMPLÈTE.
// Le client doit renvoyer TOUTES les propriétés de la tâche.
// ============================================================
router.put('/:id', (req, res) => {
    // On récupère l'ID depuis l'URL.
    const { id } = req.params;

    // On récupère les nouvelles données depuis le corps de la requête.
    const { titre, description, fait, priorite } = req.body;

    // Validation : le titre est obligatoire pour une mise à jour complète.
    if (!titre) {
        return res.status(400).json({
            succes: false,
            erreur: '❌ Le champ "titre" est obligatoire pour modifier une tâche.'
        });
    }

    // On lit toutes les tâches.
    const taches = lireTaches();

    // .findIndex() retourne la POSITION (index) de la tâche dans le tableau.
    // Si la tâche n'est pas trouvée, il retourne -1.
    // C'est différent de .find() qui retourne l'objet lui-même.
    const index = taches.findIndex(t => t.id === id);

    // Si l'index est -1, la tâche n'existe pas.
    if (index === -1) {
        return res.status(404).json({
            succes: false,
            erreur: `❌ Tâche avec l'ID "${id}" non trouvée.`
        });
    }

    // On crée la tâche mise à jour en gardant l'ID et la date de création d'origine.
    // taches[index] est la tâche existante à la position trouvée.
    const tacheMiseAJour = {
        id: taches[index].id,                        // On garde l'ID original (ne change jamais).
        titre: titre,                                 // Nouveau titre.
        description: description || '',               // Nouvelle description (ou vide par défaut).
        fait: fait !== undefined ? fait : taches[index].fait, // Nouveau statut, ou l'ancien si pas fourni.
        priorite: priorite || taches[index].priorite, // Nouvelle priorité, ou l'ancienne.
        creeLe: taches[index].creeLe,                 // On garde la date de création originale.
        modifieLe: new Date().toISOString()           // On ajoute la date de modification.
    };

    // On remplace la tâche à la position trouvée par la version mise à jour.
    // taches[index] accède directement à l'élément du tableau par sa position.
    taches[index] = tacheMiseAJour;

    // On sauvegarde.
    sauvegarderTaches(taches);

    // On renvoie la tâche modifiée avec un code 200 (OK).
    res.status(200).json({
        succes: true,
        message: '✅ Tâche modifiée avec succès !',
        donnees: tacheMiseAJour
    });
});

// ============================================================
// 📌 ENDPOINT 5 : DELETE /:id — Supprimer une tâche
// ============================================================
// URL complète : DELETE http://localhost:3000/api/taches/1
// But : Supprimer définitivement une tâche de la liste.
// DELETE est la méthode HTTP pour... supprimer ! 😄
// ============================================================
router.delete('/:id', (req, res) => {
    // On récupère l'ID de la tâche à supprimer.
    const { id } = req.params;

    // On lit toutes les tâches.
    const taches = lireTaches();

    // On cherche l'index de la tâche à supprimer.
    const index = taches.findIndex(t => t.id === id);

    // Si la tâche n'existe pas (index === -1), on renvoie une erreur 404.
    if (index === -1) {
        return res.status(404).json({
            succes: false,
            erreur: `❌ Tâche avec l'ID "${id}" non trouvée.`
        });
    }

    // .splice() modifie le tableau en supprimant des éléments à une position donnée.
    // splice(index, 1) signifie : à la position 'index', supprimer 1 élément.
    // splice() retourne un tableau contenant les éléments supprimés.
    // [tacheSupprimee] utilise la déstructuration pour récupérer le premier (et seul) élément.
    const [tacheSupprimee] = taches.splice(index, 1);

    // On sauvegarde le tableau mis à jour (sans la tâche supprimée).
    sauvegarderTaches(taches);

    // On renvoie la tâche supprimée pour confirmation.
    // Certaines APIs renvoient un code 204 (No Content) sans corps de réponse,
    // mais on préfère renvoyer un message pour plus de clarté dans l'apprentissage.
    res.status(200).json({
        succes: true,
        message: '🗑️ Tâche supprimée avec succès !',
        donnees: tacheSupprimee
    });
});

// ============================================================
// 📌 ENDPOINT 6 : PATCH /:id/toggle — Basculer le statut
// ============================================================
// URL complète : PATCH http://localhost:3000/api/taches/1/toggle
// But : Passer une tâche de "pas fait" à "fait", et vice versa.
// PATCH est la méthode HTTP pour une mise à jour PARTIELLE
// (on ne modifie qu'une seule propriété, pas toute la tâche).
// ============================================================
router.patch('/:id/toggle', (req, res) => {
    // On récupère l'ID.
    const { id } = req.params;

    // On lit toutes les tâches.
    const taches = lireTaches();

    // On cherche la tâche par son ID.
    const index = taches.findIndex(t => t.id === id);

    // Si pas trouvée → erreur 404.
    if (index === -1) {
        return res.status(404).json({
            succes: false,
            erreur: `❌ Tâche avec l'ID "${id}" non trouvée.`
        });
    }

    // L'opérateur '!' (NOT logique) inverse la valeur booléenne.
    // Si fait === true, !fait donne false, et vice versa.
    // C'est comme un interrupteur ON/OFF.
    taches[index].fait = !taches[index].fait;

    // On ajoute la date de modification.
    taches[index].modifieLe = new Date().toISOString();

    // On sauvegarde.
    sauvegarderTaches(taches);

    // On renvoie la tâche avec son nouveau statut.
    res.status(200).json({
        succes: true,
        message: taches[index].fait
            ? '✅ Tâche marquée comme faite !'       // Si fait est maintenant true
            : '⬜ Tâche marquée comme pas faite.',    // Si fait est maintenant false
        donnees: taches[index]
    });
});

// --- EXPORTATION DU ROUTEUR ---

// module.exports rend le routeur accessible depuis d'autres fichiers.
// Dans server.js, on fait require('./routes/tasks') pour l'importer.
// Sans cette ligne, les routes ne seraient pas connectées au serveur.
module.exports = router;
