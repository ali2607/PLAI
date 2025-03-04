const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate , authorizeRole } = require('../middlewares/authMiddleware');

// GET /user : Récupérer la liste des usernames avec filtrage et pagination
router.get('/', userController.getUsernames);

// PUT /user/password : Modifier le mot de passe (authentification requise)
router.put('/password', authenticate, userController.updatePassword);

// DELETE /user/delete : Supprimer le compte de l'utilisateur authentifié
router.delete('/delete', authenticate, userController.deleteAccount);

// PUT /user/givePrivilege : Permet à ROOT de modifier le rôle d'un utilisateur
router.put('/givePrivilege', authenticate, authorizeRole('ROOT'), userController.givePrivilege);

module.exports = router;
