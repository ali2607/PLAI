const { scoreInputSchema, scoreUpdateSchema, scoreOutputSchema } = require('../dto/score.dto');
const scoreRepository = require('../../infrastructure/repositories/scoreRepository');
const gameRepository = require('../../infrastructure/repositories/gameRepository');
const userRepository = require('../../infrastructure/repositories/userRepository');

const createScore = async (data) => {
  const { error, value } = scoreInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Vérifier si l'utilisateur existe
  const user = await userRepository.findById(value.userId);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Vérifier si le jeu existe
  const game = await gameRepository.getGameById(value.gameId);
  if (!game) {
    throw new Error('Jeu non trouvé');
  }

  // Création du score
  const newScore = await scoreRepository.createScore(value);
  
  // Validation des données de sortie
  const { error: outputError, value: validatedOutput } = scoreOutputSchema.validate(newScore);
  if (outputError) {
    throw new Error('Les données de sortie ne respectent pas le schéma : ' + outputError.details[0].message);
  }
  
  return validatedOutput;
};

const getScores = async ({ page = 1, limit = 10, userId, gameId }) => {
  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const offset = (pageInt - 1) * limitInt;
  
  // Récupérer les scores depuis le dépôt
  const scores = await scoreRepository.getScores({ userId, gameId, offset, limit: limitInt });
  
  // Validation de chaque score avec le schéma de sortie
  const validatedScores = scores.map(score => {
    const { error, value } = scoreOutputSchema.validate(score);
    if (error) {
      throw new Error('Les données de sortie pour un score ne respectent pas le schéma : ' + error.details[0].message);
    }
    return value;
  });
  
  return validatedScores;
};

const getScoreById = async (id) => {
  const score = await scoreRepository.getScoreById(id);
  if (!score) return null;
  
  // Validation des données de sortie
  const { error, value } = scoreOutputSchema.validate(score);
  if (error) {
    throw new Error('Les données de sortie ne respectent pas le schéma : ' + error.details[0].message);
  }
  
  return value;
};

const updateScore = async (userId, gameId, data) => {
  const { error, value } = scoreUpdateSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  
  // Mise à jour du score (création si n'existe pas)
  const updatedScore = await scoreRepository.upsertScore(userId, gameId, value.score);
  
  // Validation des données de sortie
  const { error: outputError, value: validatedOutput } = scoreOutputSchema.validate(updatedScore);
  if (outputError) {
    throw new Error('Les données de sortie ne respectent pas le schéma : ' + outputError.details[0].message);
  }
  
  return validatedOutput;
};

const deleteScore = async (id) => {
  return await scoreRepository.deleteScore(id);
};

module.exports = {
  createScore,
  getScores,
  getScoreById,
  updateScore,
  deleteScore,
};