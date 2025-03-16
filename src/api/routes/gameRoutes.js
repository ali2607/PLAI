const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticate, authorizeRole, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Management of games.
 */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Retrieve a list of games with filtering and pagination
 *     tags: [Games]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by game name.
 *     responses:
 *       200:
 *         description: List of games.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       500:
 *         description: Internal server error.
 */
router.get('/', gameController.getGames);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Retrieve a game by its ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Game identifier.
 *     responses:
 *       200:
 *         description: Game found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', gameController.getGameById);

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Create a new game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Data for the new game.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       201:
 *         description: Game created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Access denied.
 */
router.post('/', authenticate, authorizeRoles(["ROOT","ADMIN"]), gameController.createGame);

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     summary: Update an existing game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the game to update.
 *     requestBody:
 *       required: true
 *       description: Data to update the game.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       200:
 *         description: Game updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Access denied.
 */
router.put('/:id', authenticate, authorizeRoles(["ROOT","ADMIN"]), gameController.updateGame);

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Delete a game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the game to delete.
 *     responses:
 *       200:
 *         description: Game successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Game successfully deleted
 *       404:
 *         description: Game not found.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Access denied.
 */
router.delete('/:id', authenticate, authorizeRoles(["ROOT","ADMIN"]), gameController.deleteGame);

/**
 * @swagger
 * /games/{id}/scores:
 *   get:
 *     summary: Retrieve scores of all users for a specific game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Game ID.
 *     responses:
 *       200:
 *         description: List of scores for the game per user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "player1"
 *                   score:
 *                     type: integer
 *                     example: 1000
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error.
 */
router.get('/:id/scores', gameController.getGameScores);

/**
 * @swagger
 * /games/{id}/users:
 *   get:
 *     summary: Retrieve users who have played a specific game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Game ID.
 *     responses:
 *       200:
 *         description: List of users who played the game.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "player1"
 *                   score:
 *                     type: integer
 *                     example: 1000
 *                   playedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error.
 */
router.get('/:id/users', gameController.getGameUsers);

module.exports = router;
