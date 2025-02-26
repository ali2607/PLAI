const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

// GET /user : Récupérer la liste des usernames avec filtrage et pagination
router.get('/', userController.getUsernames);

// PUT /user/password : Modifier le mot de passe (authentification requise)
router.put('/password', authenticate, userController.updatePassword);

// DELETE /user/delete : Supprimer le compte de l'utilisateur authentifié
router.delete('/delete', authenticate, userController.deleteAccount);

module.exports = router;
