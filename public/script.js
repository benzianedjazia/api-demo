// ============================================================
// 🧠 script.js — Logique de l'interface (Frontend)
// ============================================================
// Ce fichier fait le lien entre l'utilisateur et notre API Node.js.
// On utilise 'fetch' pour envoyer des requêtes HTTP au serveur.
// ============================================================

// --- 1. CONFIGURATION ---
// L'URL de base de notre API. 
// Comme on est sur le même serveur, on peut utiliser des chemins relatifs.
const API_URL = '/api/taches';

// --- 2. SÉLECTION DES ÉLÉMENTS DU DOM ---
// Le DOM (Document Object Model) représente la structure de la page HTML.
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDesc = document.getElementById('task-desc');
const taskPriority = document.getElementById('task-priority');
const tasksContainer = document.getElementById('tasks-container');
const statsDisplay = document.getElementById('stats');

// --- 3. FONCTIONS PRINCIPALES ---

/**
 * Récupère toutes les tâches via l'API et les affiche.
 */
async function fetchTasks() {
    try {
        // Envoi d'une requête GET /api/taches
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.succes) {
            renderTasks(data.donnees);
            updateStats(data.donnees);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
        tasksContainer.innerHTML = '<div class="error">Impossible de charger les tâches. Vérifiez que le serveur est lancé !</div>';
    }
}

/**
 * Affiche les tâches dans le HTML dynamiquement.
 */
function renderTasks(tasks) {
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<div class="empty-state">Aucune tâche pour le moment. C\'est le moment d\'en créer une ! ✨</div>';
        return;
    }

    // On transforme chaque objet tâche en un bloc de code HTML (string).
    // .map() parcourt le tableau et .join('') fusionne tout en un seul texte.
    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task-item" id="task-${task.id}">
            <div class="task-checkbox ${task.fait ? 'checked' : ''}" onclick="toggleTask('${task.id}')"></div>
            
            <div class="task-content ${task.fait ? 'done' : ''}">
                <h3>${task.titre}</h3>
                ${task.description ? `<p>${task.description}</p>` : ''}
                <span class="badge ${task.priorite}">${task.priorite}</span>
            </div>

            <button class="delete-btn" onclick="deleteTask('${task.id}')" title="Supprimer">
                🗑️
            </button>
        </div>
    `).join('');
}

/**
 * Met à jour le petit compteur de progression.
 */
function updateStats(tasks) {
    const total = tasks.length;
    const faits = tasks.filter(t => t.fait).length;

    if (total === 0) {
        statsDisplay.textContent = 'Aucune tâche';
    } else {
        statsDisplay.textContent = `${faits} / ${total} terminées`;
    }
}

/**
 * Crée une nouvelle tâche en envoyant un POST à l'API.
 */
async function addTask(event) {
    // Empêche la page de se recharger par défaut lors de la soumission.
    event.preventDefault();

    const payload = {
        titre: taskTitle.value,
        description: taskDesc.value,
        priorite: taskPriority.value
    };

    try {
        // Envoi d'une requête POST /api/taches avec les données JSON
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.succes) {
            // On vide les champs du formulaire
            taskForm.reset();
            // On recharge la liste
            fetchTasks();
        } else {
            alert('Erreur : ' + data.erreur);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout:', error);
    }
}

/**
 * Bascule le statut d'une tâche (fait/pas fait).
 */
async function toggleTask(id) {
    try {
        // Envoi d'une requête PATCH /api/taches/:id/toggle
        const response = await fetch(`${API_URL}/${id}/toggle`, {
            method: 'PATCH'
        });

        if (response.ok) {
            fetchTasks(); // On rafraîchit la vue
        }
    } catch (error) {
        console.error('Erreur lors du toggle:', error);
    }
}

/**
 * Supprime une tâche définitivement.
 */
async function deleteTask(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) return;

    try {
        // Envoi d'une requête DELETE /api/taches/:id
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchTasks();
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
}

// --- 4. ÉCOUTEURS D'ÉVÉNEMENTS (Event Listeners) ---

// On attend que la page soit totalement chargée avant de lancer fetchTasks.
document.addEventListener('DOMContentLoaded', fetchTasks);

// On détecte quand l'utilisateur soumet le formulaire.
taskForm.addEventListener('submit', addTask);
