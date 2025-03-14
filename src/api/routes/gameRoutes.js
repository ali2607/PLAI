const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticate, authorizeRole, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Gestion des jeux.
 */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Récupérer la liste des jeux avec filtrage et pagination
 *     tags: [Games]
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom du jeu.
 *     responses:
 *       200:
 *         description: Liste des jeux.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/', gameController.getGames);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Récupérer un jeu par son identifiant
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du jeu.
 *     responses:
 *       200:
 *         description: Jeu trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Jeu non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/:id', gameController.getGameById);

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Créer un nouveau jeu
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Données du jeu à créer.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       201:
 *         description: Jeu créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Erreur de validation.
 *       401:
 *         description: Non authentifié.
 *       403:
 *         description: Accès refusé.
 */
router.post('/', authenticate, authorizeRoles(["ROOT","ADMIN"]), gameController.createGame);

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     summary: Mettre à jour un jeu existant
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du jeu à mettre à jour.
 *     requestBody:
 *       required: true
 *       description: Données à mettre à jour pour le jeu.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       200:
 *         description: Jeu mis à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Erreur de validation.
 *       401:
 *         description: Non authentifié.
 *       403:
 *         description: Accès refusé.
 */
router.put('/:id', authenticate, authorizeRoles(["ROOT","ADMIN"]), gameController.updateGame);

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Supprimer un jeu
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du jeu à supprimer.
 *     responses:
 *       200:
 *         description: Jeu supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Jeu supprimé avec succès
 *       404:
 *         description: Jeu non trouvé.
 *       401:
 *         description: Non authentifié.
 *       403:
 *         description: Accès refusé.
 */
router.delete('/:id', authenticate, authorizeRoles(["ROOT","ADMIN"]), gameController.deleteGame);

/**
 * @swagger
 * /games/{id}/scores:
 *   get:
 *     summary: Récupère les scores de tous les utilisateurs pour un jeu spécifique
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu
 *     responses:
 *       200:
 *         description: Liste des scores pour ce jeu par utilisateur
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
 *         description: Erreur serveur
 */
router.get('/:id/scores', gameController.getGameScores);

/**
 * @swagger
 * /games/{id}/users:
 *   get:
 *     summary: Récupère les utilisateurs qui ont joué à un jeu spécifique
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu
 *     responses:
 *       200:
 *         description: Liste des utilisateurs ayant joué à ce jeu
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
 *         description: Erreur serveur
 */
router.get('/:id/users', gameController.getGameUsers);


module.exports = router;
