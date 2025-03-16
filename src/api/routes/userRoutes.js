const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeRole, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management.
 */

/**
 * @swagger
 * /users/usernames:
 *   get:
 *     summary: Retrieve a list of usernames with filtering and pagination
 *     tags: [Users]
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
 *         name: username
 *         schema:
 *           type: string
 *         description: Filter by part of the username.
 *     responses:
 *       200:
 *         description: Paginated list of usernames.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: player1
 *       500:
 *         description: Internal server error.
 */
router.get('/usernames', userController.getUsernames);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users with filtering and pagination
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *         name: username
 *         schema:
 *           type: string
 *         description: Filter by part of the username.
 *     responses:
 *       200:
 *         description: Paginated list of users with full details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: player1
 *                   email:
 *                     type: string
 *                     example: player1@example.com
 *                   role:
 *                     type: string
 *                     example: ADMIN
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T12:00:00Z"
 *       403:
 *         description: Access denied (restricted to ADMIN/ROOT).
 *       500:
 *         description: Internal server error.
 */
router.get('/', authenticate, authorizeRoles(['ADMIN', 'ROOT']), userController.getUsers);

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Change the password of the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: New password for the user.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Not authenticated.
 */
router.put('/password', authenticate, userController.updatePassword);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete the account of the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 *       401:
 *         description: Not authenticated.
 *       500:
 *         description: Internal server error.
 */
router.delete('/', authenticate, userController.deleteAccount);

/**
 * @swagger
 * /users/givePrivilege:
 *   put:
 *     summary: Change the role of a user (ROOT access only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Data to change the user's role.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *               - newRole
 *             properties:
 *               targetUserId:
 *                 type: integer
 *                 example: 2
 *               newRole:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *                 example: ADMIN
 *     responses:
 *       200:
 *         description: Privilege updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Privilege updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     username:
 *                       type: string
 *                       example: player1
 *                     role:
 *                       type: string
 *                       example: ADMIN
 *       400:
 *         description: Validation error or invalid role.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Access denied.
 */
router.put('/givePrivilege', authenticate, authorizeRole('ROOT'), userController.givePrivilege);

/**
 * @swagger
 * /users/{id}/scores:
 *   get:
 *     summary: Retrieve scores for a user across all games they have played
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID.
 *     responses:
 *       200:
 *         description: List of the user's scores by game.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   gameId:
 *                     type: integer
 *                     example: 1
 *                   gameName:
 *                     type: string
 *                     example: "Pac-Man"
 *                   score:
 *                     type: integer
 *                     example: 1000
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error.
 */
router.get('/:id/scores', userController.getUserScores);

/**
 * @swagger
 * /users/{id}/games:
 *   get:
 *     summary: Retrieve games that a user has played
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID.
 *     responses:
 *       200:
 *         description: List of games the user has played.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   gameId:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Pac-Man"
 *                   description:
 *                     type: string
 *                     example: "A classic arcade game"
 *                   playedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error.
 */
router.get('/:id/games', userController.getUserGames);

module.exports = router;
