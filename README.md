# 🚀 Mini-Projet : API Gestionnaire de Tâches (Node.js + Express)

Ce projet est une API REST simple conçue pour aider les débutants à comprendre les bases de Node.js, d'Express et de la conteneurisation avec Docker. Chaque ligne de code est commentée en français pour expliquer son rôle.

## 🛠️ Technologies utilisées

- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express.js** : Framework web pour créer des APIs facilement.
- **CORS** : Pour autoriser les requêtes depuis d'autres domaines.
- **UUID** : Pour générer des identifiants (IDs) uniques automatiquement.
- **Docker** : Pour emballer l'application dans un conteneur isolé.

---

## 🏃 Comment lancer le projet ?

### Option 1 : Localement (Sans Docker)
1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Lancez le serveur :
   ```bash
   node server.js
   ```
3. Ouvrez votre navigateur sur `http://localhost:3000`.

### Option 2 : Avec Docker (Recommandé) 🐋
1. Assurez-vous d'avoir Docker installé sur votre machine.
2. Lancez le projet avec Docker Compose :
   ```bash
   docker-compose up --build
   ```
3. Ouvrez votre navigateur sur `http://localhost:3000`.

---

## 🔗 Liste des Endpoints (Points d'accès)

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/taches` | Affiche toutes vos tâches |
| `GET` | `/api/taches/:id` | Affiche une tâche spécifique via son ID |
| `POST` | `/api/taches` | Ajoute une nouvelle tâche |
| `PUT` | `/api/taches/:id` | Modifie complètement une tâche |
| `DELETE` | `/api/taches/:id` | Supprime une tâche définitivement |
| `PATCH` | `/api/taches/:id/toggle` | Coche/Décoche une tâche (fait / pas fait) |

---

## 🧠 Concepts clés à apprendre

### 1. Qu'est-ce qu'une API REST ?
C'est un moyen pour deux logiciels de communiquer. Ton application (le serveur) attend des requêtes (GET, POST, etc.) et répond généralement avec des données au format **JSON**.

### 2. Pourquoi utiliser Docker ?
Docker permet de créer une "bulle" (un conteneur) qui contient tout ce dont ton application a besoin pour fonctionner (Node.js, bibliothèques, code). Cela garantit que l'app fonctionnera de la même manière sur ton ordi, sur celui de ton collègue ou en production.

- **Dockerfile** : La liste des instructions pour créer cette bulle.
- **docker-compose.yml** : Un outil pour lancer et configurer facilement un ou plusieurs conteneurs.

### 3. Les fichiers du projet
- `server.js` : Le cerveau. Il configure le serveur et connecte les routes.
- `routes/tasks.js` : Les muscles. C'est ici que sont définies les actions pour chaque URL.
- `data/tasks.json` : La mémoire. C'est notre petite base de données sous forme de fichier.

---

## 🧪 Comment tester ?

Ouvrez votre navigateur et allez sur `http://localhost:3000/api/taches` pour voir vos premières tâches ! Pour créer ou modifier des tâches, vous pouvez utiliser un outil comme **Postman** ou **Insomnia**.
