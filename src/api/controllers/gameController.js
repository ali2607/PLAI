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
    if (!game) return res.status(404).json({ message: 'Game not found' });
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
    res.json({ message: 'Game successfully deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get scores of all users for a specific game
const getGameScores = async (req, res) => {
  try {
    const { id } = req.params;
    
    const scores = await gameService.getGameScores(parseInt(id));
    
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get users who played a specific game
const getGameUsers = async (req, res) => {
  try {
    const { id } = req.params;
    
    const users = await gameService.getGameUsers(parseInt(id));
    
    res.json(users);
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
  getGameScores,
  getGameUsers
};
