const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Récupérer la liste des jeux avec filtrage et pagination
router.get('/', gameController.getGames);

// Récupérer un jeu par son identifiant
router.get('/:id', gameController.getGameById);

// Créer un nouveau jeu
router.post('/', gameController.createGame);

// Mettre à jour un jeu existant
router.put('/:id', gameController.updateGame);

// Supprimer un jeu
router.delete('/:id', gameController.deleteGame);

module.exports = router;
