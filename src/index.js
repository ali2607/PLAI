const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({path: '../.env'});

app.use(express.json());
app.use(cookieParser());

// Documentation OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Import et montage des routes d'authentification
const authRoutes = require('./api/routes/authRoutes');
app.use('/auth', authRoutes);

// Import des routes utilisateur
const userRoutes = require('./api/routes/userRoutes');
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
