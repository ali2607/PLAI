const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const dotenv = require('dotenv');

dotenv.config({path: '../.env'});

app.use(express.json());

// Documentation OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import et montage des routes d'authentification
const authRoutes = require('./api/routes/authRoutes');
app.use('/auth', authRoutes);

// Import des routes utilisateur
const userRoutes = require('./api/routes/userRoutes');
app.use('/user', userRoutes);

// Routes pour les jeux
const gameRoutes = require('./api/routes/gameRoutes');
app.use('/game', gameRoutes);

// Routes pour les scores
const scoreRoutes = require('./api/routes/scoreRoutes');
app.use('/score', scoreRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
