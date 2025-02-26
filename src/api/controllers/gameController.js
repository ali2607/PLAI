const gameService = require('../../application/services/gameService');

const createGame = async (req, res) => {
  try {
    const newGame = await gameService.createGame(req.body);
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getGames = async (req, res) => {
  try {
    const { page, limit, name } = req.query;
    const games = await gameService.getGames({ page, limit, name });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await gameService.getGameById(parseInt(id));
    if (!game) return res.status(404).json({ message: 'Jeu non trouvé' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGame = await gameService.updateGame(parseInt(id), req.body);
    res.json(updatedGame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    await gameService.deleteGame(parseInt(id));
    res.json({ message: 'Jeu supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
};
