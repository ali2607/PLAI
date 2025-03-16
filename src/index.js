const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet')

dotenv.config({path: '../.env'});

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

// OpenAPI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes for authentication
const authRoutes = require('./api/routes/authRoutes');
app.use('/auth', authRoutes);

// Routes for users
const userRoutes = require('./api/routes/userRoutes');
app.use('/users', userRoutes);

// Routes for games
const gameRoutes = require('./api/routes/gameRoutes');
app.use('/games', gameRoutes);

// Routes for scores
const scoreRoutes = require('./api/routes/scoreRoutes');
app.use('/scores', scoreRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
