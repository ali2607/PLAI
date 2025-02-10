# Utilisez une image Node officielle
FROM node:16-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port utilisé par Express (par exemple 3000)
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
