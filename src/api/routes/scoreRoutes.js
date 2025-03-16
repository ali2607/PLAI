const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Scores
 *   description: Management of game scores.
 */

/**
 * @swagger
 * /scores:
 *   get:
 *     summary: Retrieve a list of scores with filtering and pagination
 *     tags: [Scores]
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
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID.
 *       - in: query
 *         name: gameId
 *         schema:
 *           type: integer
 *         description: Filter by game ID.
 *     responses:
 *       200:
 *         description: List of scores.
 *       500:
 *         description: Internal server error.
 */
router.get('/', scoreController.getScores);

/**
 * @swagger
 * /scores/{id}:
 *   get:
 *     summary: Retrieve a score by its ID
 *     tags: [Scores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Score identifier.
 *     responses:
 *       200:
 *         description: Score found.
 *       404:
 *         description: Score not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', scoreController.getScoreById);

/**
 * @swagger
 * /scores:
 *   post:
 *     summary: Create a new score
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - gameId
 *               - score
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               gameId:
 *                 type: integer
 *                 example: 1
 *               score:
 *                 type: integer
 *                 example: 1000
 *     responses:
 *       201:
 *         description: Score created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Not authenticated.
 */
router.post('/', authenticate, authorizeRoles(["ROOT","ADMIN"]), scoreController.createScore);

/**
 * @swagger
 * /scores/{id}:
 *   delete:
 *     summary: Delete a score
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Score identifier to delete.
 *     responses:
 *       200:
 *         description: Score successfully deleted.
 *       404:
 *         description: Score not found.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Access denied.
 */
router.delete('/:id', authenticate, authorizeRoles(["ROOT","ADMIN"]), scoreController.deleteScore);

/**
 * @swagger
 * /scores/users/{userId}/games/{gameId}:
 *   get:
 *     summary: Retrieve scores of a user for a specific game
 *     tags: [Scores]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID.
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Game ID.
 *     responses:
 *       200:
 *         description: Scores found.
 *       404:
 *         description: Scores not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/users/:userId/games/:gameId', scoreController.getUserGameScores);

/**
 * @swagger
 * /scores/users/{userId}/games/{gameId}:
 *   put:
 *     summary: Update the score of a user for a specific game
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID.
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Game ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: integer
 *                 example: 1500
 *     responses:
 *       200:
 *         description: Score updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Not authenticated.
 */
router.put('/users/:userId/games/:gameId', authenticate, scoreController.updateUserGameScore);

module.exports = router;
