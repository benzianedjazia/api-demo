# ============================================================
# 🐋 Dockerfile — Instructions pour créer l'image de notre API
# ============================================================
# Un Dockerfile est comme une "recette de cuisine".
# Il explique à Docker comment construire l'environnement pour notre app.
# ============================================================

# --- 1. IMAGE DE BASE ---
# On commence par une image officielle de Node.js.
# '22-slim' est une version légère (petite taille) de Node.js v22.
FROM node:22-slim

# --- 2. RÉPERTOIRE DE TRAVAIL ---
# On définit où les fichiers vont être placés à l'intérieur du conteneur.
# C'est comme créer un dossier 'app' et faire 'cd app'.
WORKDIR /app

# --- 3. INSTALLATION DES DÉPENDANCES ---
# On copie d'abord SEULEMENT les fichiers de configuration de npm.
# Pourquoi ? Pour utiliser le "cache" de Docker et accélérer la construction.
COPY package*.json ./

# On installe les dépendances (express, cors, uuid).
# 'npm install' va lire le package.json copié juste au-dessus.
RUN npm install

# --- 4. COPIE DU CODE SOURCE ---
# Une fois les dépendances installées, on copie tout le reste de notre code.
# Le premier '.' est notre dossier actuel (sur l'ordi).
# Le deuxième '.' est le dossier WORKDIR (dans le conteneur).
COPY . .

# --- 5. EXPOSITION DU PORT ---
# On indique que notre application écoute sur le port 3000.
# C'est une documentation pour Docker, ça ne "ouvre" pas le port tout seul.
EXPOSE 3000

# --- 6. COMMANDE DE DÉMARRAGE ---
# C'est la commande qui s'exécutera quand on lancera le conteneur.
# C'est l'équivalent de taper 'node server.js' dans le terminal.
CMD ["node", "server.js"]
