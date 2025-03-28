const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PLAI API',
      version: '1.0.0',
      description: 'API documentation for mini-games',
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
  },
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
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: player1
 *         email:
 *           type: string
 *           example: email@example.com
 *         password:
 *           type: string
 *           example: password123
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
 *           example: password123
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
 *           example: A classic arcade game.
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
 *           example: A classic arcade game.
 *     Score:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         score:
 *           type: integer
 *           example: 1000
 *         userId:
 *           type: integer
 *           example: 1
 *         gameId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: player1
 *         game:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Pac-Man
 *     ScoreInput:
 *       type: object
 *       required:
 *         - userId
 *         - gameId
 *         - score
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *         gameId:
 *           type: integer
 *           example: 1
 *         score:
 *           type: integer
 *           example: 1000
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT 
 */
