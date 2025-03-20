# PLAI

## Description du projet

**PLAI** est un projet qui a pour but final de contribuer à un site de jeu. L'objectif est de créer plusieurs jeux exploitant les différentes caractéristiques de différents modèles d'IA pour avoir une expérience de jeu nouvelle. 
Pour l'instant, dans le cadre du projet d'architecture orientée service, nous avons uniquement une API qui gère et manipule des utilisateurs, des jeux et des scores.  

## prérequis
- Docker desktop installé et mis à jour.

## Instructions de lancement du projet

1. **Télécharger le projet**  
   Clonez ou téléchargez ce dépôt sur votre machine locale.

2. **Lancer Docker Desktop**  
   lancez l'application Docker Desktop pour pouvoir executer les images.
      
3. **Construire l'image Docker**  
   Depuis votre terminal, à la racine du projet, exécutez la commande :
   ```bash
   docker-compose up --build
   ```
   - l'interface Swagger de l'api se trouve à l'url suivante http://localhost:3000/api-docs/
