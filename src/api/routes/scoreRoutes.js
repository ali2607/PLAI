const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Scores
 *   description: Gestion des scores de jeu.
 */

/**
 * @swagger
 * /scores:
 *   get:
 *     summary: Récupérer la liste des scores avec filtrage et pagination
 *     tags: [Scores]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page pour la pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page.
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filtrer par ID utilisateur.
 *       - in: query
 *         name: gameId
 *         schema:
 *           type: integer
 *         description: Filtrer par ID jeu.
 *     responses:
 *       200:
 *         description: Liste des scores.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/', scoreController.getScores);

/**
 * @swagger
 * /scores/{id}:
 *   get:
 *     summary: Récupérer un score par son identifiant
 *     tags: [Scores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du score.
 *     responses:
 *       200:
 *         description: Score trouvé.
 *       404:
 *         description: Score non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/:id', scoreController.getScoreById);

/**
 * @swagger
 * /scores:
 *   post:
 *     summary: Créer un nouveau score
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
 *         description: Score créé avec succès.
 *       400:
 *         description: Erreur de validation.
 *       401:
 *         description: Non authentifié.
 */
router.post('/', authenticate, authorizeRoles(["ROOT","ADMIN"]), scoreController.createScore);

/**
 * @swagger
 * /scores/{id}:
 *   delete:
 *     summary: Supprimer un score
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du score à supprimer.
 *     responses:
 *       200:
 *         description: Score supprimé avec succès.
 *       404:
 *         description: Score non trouvé.
 *       401:
 *         description: Non authentifié.
 *       403:
 *         description: Accès refusé.
 */
router.delete('/:id', authenticate, authorizeRoles(["ROOT","ADMIN"]), scoreController.deleteScore);

/**
 * @swagger
 * /scores/users/{userId}/games/{gameId}:
 *   get:
 *     summary: Récupérer les scores d'un utilisateur pour un jeu spécifique
 *     tags: [Scores]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur.
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu.
 *     responses:
 *       200:
 *         description: Scores trouvés.
 *       404:
 *         description: Scores non trouvés.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/users/:userId/games/:gameId', scoreController.getUserGameScores);

/**
 * @swagger
 * /scores/users/{userId}/games/{gameId}:
 *   put:
 *     summary: Mettre à jour le score d'un utilisateur pour un jeu spécifique
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur.
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu.
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
 *         description: Score mis à jour avec succès.
 *       400:
 *         description: Erreur de validation.
 *       401:
 *         description: Non authentifié.
 */
router.put('/users/:userId/games/:gameId', authenticate, scoreController.updateUserGameScore);

module.exports = router;