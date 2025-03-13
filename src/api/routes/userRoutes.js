const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeRole, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Gestion des utilisateurs.
 */

/**
 * @swagger
 * /user/usernames:
 *   get:
 *     summary: Récupérer la liste des usernames avec filtrage et pagination
 *     tags: [User]
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
 *         name: username
 *         schema:
 *           type: string
 *         description: Filtrer par partie du nom d'utilisateur.
 *     responses:
 *       200:
 *         description: Liste paginée des usernames.
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
 *         description: Erreur interne du serveur.
 */
router.get('/usernames', userController.getUsernames);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Récupérer la liste des utilisateurs avec filtrage et pagination
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *         name: username
 *         schema:
 *           type: string
 *         description: Filtrer par partie du nom d'utilisateur.
 *     responses:
 *       200:
 *         description: Liste paginée des utilisateurs complets
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
 *         description: Accès refusé (réservé aux ADMIN/ROOT)
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', authenticate, authorizeRoles(['ADMIN', 'ROOT']), userController.getUsers);

/**
 * @swagger
 * /user/password:
 *   put:
 *     summary: Modifier le mot de passe de l'utilisateur connecté
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Nouveau mot de passe de l'utilisateur.
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
 *                 example: nouveauPass123
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès.
 *       400:
 *         description: Erreur de validation.
 *       401:
 *         description: Non authentifié.
 */
router.put('/password', authenticate, userController.updatePassword);

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Supprimer le compte de l'utilisateur connecté
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compte supprimé avec succès.
 *       401:
 *         description: Non authentifié.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.delete('/delete', authenticate, userController.deleteAccount);

/**
 * @swagger
 * /user/givePrivilege:
 *   put:
 *     summary: Modifier le rôle d'un utilisateur (accès réservé au ROOT)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Données pour modifier le rôle d'un utilisateur.
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
 *         description: Privilège mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Privilège mis à jour avec succès
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
 *         description: Erreur de validation ou rôle non valide.
 *       401:
 *         description: Non authentifié.
 *       403:
 *         description: Accès refusé.
 */
router.put('/givePrivilege', authenticate, authorizeRole('ROOT'), userController.givePrivilege);

module.exports = router;
