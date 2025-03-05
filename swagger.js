// swaggerOptions.js
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API PLAI',
      version: '1.0.0',
      description: 'Documentation de l\'API de mini-jeux',
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
  },
  // Indiquez ici le chemin de vos fichiers contenant des commentaires JSDoc
  apis: ['./src/api/routes/*.js', "./swagger.js"],
};


const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: player1
 *         password:
 *           type: string
 *           example: motdepasse123
 *     UserLogin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: player1
 *         password:
 *           type: string
 *           example: motdepasse123
 *     Game:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Pac-Man
 *         description:
 *           type: string
 *           example: Un classique de l’arcade...
 *         createdAt:
 *           type: string
 *           format: date-time
 *     GameInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           example: Pac-Man
 *         description:
 *           type: string
 *           example: Un classique de l’arcade...
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT 
*/
