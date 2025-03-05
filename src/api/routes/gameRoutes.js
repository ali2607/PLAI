const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: Gestion des jeux.
 */

/**
 * @swagger
 * /game:
 *   get:
 *     summary: Récupérer la liste des jeux avec filtrage et pagination
 *     tags: [Game]
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
 * /game/{id}:
 *   get:
 *     summary: Récupérer un jeu par son identifiant
 *     tags: [Game]
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
 * /game:
 *   post:
 *     summary: Créer un nouveau jeu
 *     tags: [Game]
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
router.post('/', authenticate, authorizeRole(["ROOT","ADMIN"]), gameController.createGame);

/**
 * @swagger
 * /game/{id}:
 *   put:
 *     summary: Mettre à jour un jeu existant
 *     tags: [Game]
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
router.put('/:id', authenticate, authorizeRole(["ROOT","ADMIN"]), gameController.updateGame);

/**
 * @swagger
 * /game/{id}:
 *   delete:
 *     summary: Supprimer un jeu
 *     tags: [Game]
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
 *       404:
 *         description: Jeu non trouvé.
 *       401:
 *         description: Non authentifié.
 *       403:
 *         description: Accès refusé.
 */
router.delete('/:id', authenticate, authorizeRole(["ROOT","ADMIN"]), gameController.deleteGame);

module.exports = router;
