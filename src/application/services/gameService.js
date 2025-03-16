const { gameInputSchema, gameOutputSchema, gameScoreOutputSchema, gameUserOutputSchema } = require('../dto/game.dto');
const gameRepository = require('../../infrastructure/repositories/gameRepository');
const scoreRepository = require('../../infrastructure/repositories/scoreRepository');

const createGame = async (data) => {
  const { error, value } = gameInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  // Verify name uniqueness
  const existingGame = await gameRepository.findByName(value.name);
  if (existingGame) {
    throw new Error('A game with this name already exists');
  }
  // Create game
  const newGame = await gameRepository.createGame(value);
  
  // Validate output data
  const { error: outputError, value: validatedOutput } = gameOutputSchema.validate(newGame);
  if (outputError) {
    throw new Error('Output data does not match the schema: ' + outputError.details[0].message);
  }
  
  return validatedOutput;
};

const getGames = async ({ page = 1, limit, name }) => {
  let games;

  if (limit !== undefined) {
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const offset = (pageInt - 1) * limitInt;
  
    // Retrieve games with pagination
    games = await gameRepository.getGames({ name, offset, limit: limitInt });
  } else {
    // No limit specified: retrieve all games
    games = await gameRepository.getGames({ name });
  }
  
  // Validate each game with the output schema
  const validatedGames = games.map(game => {
    const { error, value } = gameOutputSchema.validate(game);
    if (error) {
      throw new Error('Output data for a game does not match the schema: ' + error.details[0].message);
    }
    return value;
  });
  
  return validatedGames;
};

const getGameById = async (id) => {
  const game = await gameRepository.getGameById(id);
  if (!game) return null;
  
  // Validate output data
  const { error, value } = gameOutputSchema.validate(game);
  if (error) {
    throw new Error('Output data does not match the schema: ' + error.details[0].message);
  }
  
  return value;
};

const updateGame = async (id, data) => {
  const { error, value } = gameInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const updatedGame = await gameRepository.updateGame(id, value);
  
  // Validate output data
  const { error: outputError, value: validatedOutput } = gameOutputSchema.validate(updatedGame);
  if (outputError) {
    throw new Error('Output data does not match the schema: ' + outputError.details[0].message);
  }
  
  return validatedOutput;
};

const deleteGame = async (id) => {
  return await gameRepository.deleteGame(id);
};

/**
 * Retrieves the scores of all users for a specific game
 */
const getGameScores = async (gameId) => {
  // Verify if the game exists
  const game = await gameRepository.getGameById(gameId);
  if (!game) {
    throw new Error('Game not found');
  }  
  // Retrieve scores for this game
  const scores = await scoreRepository.getScoresByGameId(gameId);
  
  // Transform and validate data using the DTO
  const validatedScores = scores.map(score => {
    const scoreData = {
      userId: score.userId,
      username: score.user.username,
      score: score.score,
      createdAt: score.createdAt
    };
    
    const { error, value } = gameScoreOutputSchema.validate(scoreData);
    if (error) {
      throw new Error('Output data for a score does not match the schema: ' + error.details[0].message);
    }
    return value;
  });
  
  return validatedScores;
};

/**
 * Retrieves users who played a specific game
 */
const getGameUsers = async (gameId) => {
  // Verify if the game exists
  const game = await gameRepository.getGameById(gameId);
  if (!game) {
    throw new Error('Game not found');
  }
  
  // Retrieve users who played this game
  const users = await scoreRepository.getUsersByGameId(gameId);
  
  // Transform and validate data using the DTO
  const validatedUsers = users.map(item => {
    const userData = {
      userId: item.user.id,
      username: item.user.username,
      score: item.score,
      playedAt: item.createdAt
    };
    
    const { error, value } = gameUserOutputSchema.validate(userData);
    if (error) {
      throw new Error('Output data for a user does not match the schema: ' + error.details[0].message);
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
