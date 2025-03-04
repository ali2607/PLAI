const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticate } = require('../middlewares/authMiddleware');


// Récupérer la liste des jeux avec filtrage et pagination
router.get('/', gameController.getGames);

// Récupérer un jeu par son identifiant
router.get('/:id', gameController.getGameById);

// Créer un nouveau jeu
router.post('/', authenticate, gameController.createGame);

// Mettre à jour un jeu existant
router.put('/:id', authenticate, gameController.updateGame);

// Supprimer un jeu
router.delete('/:id', authenticate, gameController.deleteGame);

module.exports = router;
