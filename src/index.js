const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const dotenv = require('dotenv');

dotenv.config({path: '../.env'});

app.use(express.json());


// Documentation OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Import des routes dummy
const dummyRoutes = require('./api/routes/dummyRoutes');

// Montage des routes sous un prefixe (par exemple /api/v1/dummy)
app.use('/dummy', dummyRoutes);

// Import et montage des routes d'authentification
const authRoutes = require('./api/routes/authRoutes');
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
