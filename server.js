// ============================================================
// 📦 server.js — Point d'entrée principal de notre API
// ============================================================
// C'est le fichier qui démarre notre serveur web.
// Il configure Express et connecte toutes les routes.
// ============================================================

// --- 1. IMPORTATION DES MODULES ---

// 'express' est un framework web pour Node.js.
// Il simplifie la création de serveurs et d'APIs.
// Sans Express, il faudrait tout coder à la main avec le module 'http' de Node.js.
const express = require('express');

// 'cors' permet d'autoriser les requêtes venant d'autres sites/domaines.
// Par exemple, si ton frontend est sur localhost:5173 et ton API sur localhost:3000,
// sans CORS, le navigateur bloquerait les requêtes. CORS résout ce problème.
const cors = require('cors');

// 'path' est un module intégré à Node.js (pas besoin de l'installer).
// Il aide à travailler avec les chemins de fichiers de manière fiable,
// quel que soit le système d'exploitation (Windows, Mac, Linux).
const path = require('path');

// On importe nos routes de tâches depuis le dossier 'routes'.
// Ces routes définissent comment l'API répond à chaque requête.
const taskRoutes = require('./routes/tasks');

// --- 2. CRÉATION DE L'APPLICATION EXPRESS ---

// express() crée une nouvelle application Express.
// C'est comme "allumer" notre serveur. On stocke l'app dans une variable.
const app = express();

// On définit le port sur lequel le serveur va écouter.
// process.env.PORT regarde d'abord si un port est défini dans les variables d'environnement.
// Si ce n'est pas le cas, on utilise le port 3000 par défaut.
// Les variables d'environnement sont utiles en production (Heroku, Railway, etc.).
const PORT = process.env.PORT || 3000;

// --- 3. CONFIGURATION DES MIDDLEWARES ---

// Un "middleware" est une fonction qui s'exécute ENTRE la requête du client
// et la réponse du serveur. C'est comme un filtre ou un contrôle de sécurité.

// app.use() dit à Express : "utilise ce middleware pour TOUTES les requêtes".

// cors() autorise les requêtes depuis d'autres origines (domaines).
// Sans ça, un site web sur un autre domaine ne pourrait pas appeler notre API.
app.use(cors());

// express.json() permet à Express de comprendre les données envoyées en JSON.
// Quand un client envoie des données (ex: une nouvelle tâche), elles arrivent
// sous forme de texte JSON. Ce middleware les transforme en objet JavaScript.
// Sans ça, req.body serait 'undefined' et on ne pourrait pas lire les données.
app.use(express.json());

// express.static() permet de servir des fichiers "statiques" (HTML, CSS, images, JS frontend).
// On lui dit de regarder dans le dossier 'public'.
// Ainsi, si on va sur http://localhost:3000/, Express cherchera index.html dans 'public'.
app.use(express.static('public'));

// --- 4. ROUTE D'ACCUEIL ---

// app.get() crée une route qui répond aux requêtes HTTP GET.
// '/' signifie la racine du site, c'est-à-dire http://localhost:3000/
// req = la requête du client (ce qu'il demande)
// res = la réponse du serveur (ce qu'on lui renvoie)
app.get('/', (req, res) => {
    // res.json() envoie une réponse au format JSON.
    // JSON est le format standard pour les APIs (comme un langage universel).
    res.json({
        message: '🎉 Bienvenue sur l\'API Gestionnaire de Tâches !',
        version: '1.0.0',
        endpoints: {
            'GET /api/taches': 'Récupérer toutes les tâches',
            'GET /api/taches/:id': 'Récupérer une tâche par son ID',
            'POST /api/taches': 'Créer une nouvelle tâche',
            'PUT /api/taches/:id': 'Modifier une tâche complète',
            'DELETE /api/taches/:id': 'Supprimer une tâche',
            'PATCH /api/taches/:id/toggle': 'Basculer le statut fait/pas fait'
        }
    });
});

// --- 5. CONNEXION DES ROUTES DE L'API ---

// app.use() connecte nos routes de tâches à l'URL '/api/taches'.
// Toutes les routes définies dans taskRoutes seront préfixées par '/api/taches'.
// Par exemple, si dans taskRoutes on a router.get('/'), ça donnera GET /api/taches/
app.use('/api/taches', taskRoutes);

// --- 6. GESTION DES ROUTES INEXISTANTES (404) ---

// Ce middleware s'exécute si aucune route précédente n'a répondu.
// Ça veut dire que l'URL demandée n'existe pas dans notre API.
// On renvoie un code 404 (Not Found = Non trouvé) avec un message d'erreur.
app.use((req, res) => {
    res.status(404).json({
        erreur: '❌ Route non trouvée',
        message: `L'URL ${req.method} ${req.url} n'existe pas sur ce serveur.`,
        conseil: 'Vérifiez l\'URL et la méthode HTTP (GET, POST, PUT, DELETE).'
    });
});

// --- 7. DÉMARRAGE DU SERVEUR ---

// app.listen() démarre le serveur et le fait écouter sur le port défini.
// Le callback (fonction) s'exécute une fois que le serveur est prêt.
app.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(55));
    console.log('🚀 Serveur démarré avec succès !');
    console.log(`📡 URL : http://localhost:${PORT}`);
    console.log(`📋 API : http://localhost:${PORT}/api/taches`);
    console.log('='.repeat(55));
    console.log('');
    console.log('💡 Pour tester, ouvrez votre navigateur et allez sur :');
    console.log(`   http://localhost:${PORT}/api/taches`);
    console.log('');
    console.log('🛑 Pour arrêter le serveur, appuyez sur Ctrl + C');
    console.log('');
});
