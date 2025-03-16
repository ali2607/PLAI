const scoreService = require('../../application/services/scoreService');

const createScore = async (req, res) => {
  try {
    const newScore = await scoreService.createScore(req.body);
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getScores = async (req, res) => {
  try {
    const { page, limit, userId, gameId } = req.query;
    const scores = await scoreService.getScores({ page, limit, userId, gameId });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getScoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const score = await scoreService.getScoreById(parseInt(id));
    if (!score) return res.status(404).json({ message: 'Score not found' });
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserGameScores = async (req, res) => {
  try {
    const { userId, gameId } = req.params;
    const scores = await scoreService.getScores({ userId, gameId });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserGameScore = async (req, res) => {
  try {
    const { userId, gameId } = req.params;
    const updatedScore = await scoreService.updateScore(userId, gameId, req.body);
    res.json(updatedScore);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteScore = async (req, res) => {
  try {
    const { id } = req.params;
    await scoreService.deleteScore(parseInt(id));
    res.json({ message: 'Score successfully deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createScore,
  getScores,
  getScoreById,
  getUserGameScores,
  updateUserGameScore,
  deleteScore,
};