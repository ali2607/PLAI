const { gameInputSchema, gameOutputSchema, gameScoreOutputSchema, gameUserOutputSchema } = require('../dto/game.dto');
const gameRepository = require('../../infrastructure/repositories/gameRepository');
const scoreRepository = require('../../infrastructure/repositories/scoreRepository');

const createGame = async (data) => {
  const { error, value } = gameInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  // Vérifier l'unicité du nom
  const existingGame = await gameRepository.findByName(value.name);
  if (existingGame) {
    throw new Error('Un jeu avec ce nom existe déjà');
  }
  // Création du jeu
  const newGame = await gameRepository.createGame(value);
  
  // Validation des données de sortie
  const { error: outputError, value: validatedOutput } = gameOutputSchema.validate(newGame);
  if (outputError) {
    throw new Error('Les données de sortie ne respectent pas le schéma : ' + outputError.details[0].message);
  }
  
  return validatedOutput;};

const getGames = async ({ page = 1, limit, name }) => {
  let games;

  if (limit !== undefined) {
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const offset = (pageInt - 1) * limitInt;
  
    // Récupérer les jeux avec pagination
    games = await gameRepository.getGames({ name, offset, limit: limitInt });
  } else {
    // Aucun limit précisé : récupérer l'intégralité des jeux
    games = await gameRepository.getGames({ name });
  }
  
  // Validation de chaque jeu avec le schéma de sortie
  const validatedGames = games.map(game => {
    const { error, value } = gameOutputSchema.validate(game);
    if (error) {
      throw new Error('Les données de sortie pour un jeu ne respectent pas le schéma : ' + error.details[0].message);
    }
    return value;
  });
  
  return validatedGames;
};

const getGameById = async (id) => {
  const game = await gameRepository.getGameById(id);
  if (!game) return null;
  
  // Validation des données de sortie
  const { error, value } = gameOutputSchema.validate(game);
  if (error) {
    throw new Error('Les données de sortie ne respectent pas le schéma : ' + error.details[0].message);
  }
  
  return value;
};

const updateGame = async (id, data) => {
  const { error, value } = gameInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const updatedGame = await gameRepository.updateGame(id, value);
  
  // Validation des données de sortie
  const { error: outputError, value: validatedOutput } = gameOutputSchema.validate(updatedGame);
  if (outputError) {
    throw new Error('Les données de sortie ne respectent pas le schéma : ' + outputError.details[0].message);
  }
  
  return validatedOutput;
};

const deleteGame = async (id) => {
  return await gameRepository.deleteGame(id);
};

/**
 * Récupère les scores de tous les utilisateurs pour un jeu spécifique
 */
const getGameScores = async (gameId) => {
  // Vérifier si le jeu existe
  const game = await gameRepository.getGameById(gameId);
  if (!game) {
    throw new Error('Jeu non trouvé');
  }  
  // Récupérer les scores pour ce jeu
  const scores = await scoreRepository.getScoresByGameId(gameId);
  
  // Transformer et valider les données avec le DTO
  const validatedScores = scores.map(score => {
    const scoreData = {
      userId: score.userId,
      username: score.user.username,
      score: score.score,
      createdAt: score.createdAt
    };
    
    const { error, value } = gameScoreOutputSchema.validate(scoreData);
    if (error) {
      throw new Error('Les données de sortie pour un score ne respectent pas le schéma : ' + error.details[0].message);
    }
    return value;
  });
  
  return validatedScores;
};

/**
 * Récupère les utilisateurs ayant joué à un jeu spécifique
 */
const getGameUsers = async (gameId) => {
  // Vérifier si le jeu existe
  const game = await gameRepository.getGameById(gameId);
  if (!game) {
    throw new Error('Jeu non trouvé');
  }
  
  // Récupérer les utilisateurs ayant joué à ce jeu
  const users = await scoreRepository.getUsersByGameId(gameId);
  
  // Transformer et valider les données avec le DTO
  const validatedUsers = users.map(item => {
    const userData = {
      userId: item.user.id,
      username: item.user.username,
      score: item.score,
      playedAt: item.createdAt
    };
    
    const { error, value } = gameUserOutputSchema.validate(userData);
    if (error) {
      throw new Error('Les données de sortie pour un utilisateur ne respectent pas le schéma : ' + error.details[0].message);
    }
    return value;
  });
  
  return validatedUsers;
};

module.exports = {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
  getGameUsers,
  getGameScores
};
