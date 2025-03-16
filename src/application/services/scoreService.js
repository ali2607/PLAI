const { scoreInputSchema, scoreUpdateSchema, scoreOutputSchema } = require('../dto/score.dto');
const scoreRepository = require('../../infrastructure/repositories/scoreRepository');
const gameRepository = require('../../infrastructure/repositories/gameRepository');
const userRepository = require('../../infrastructure/repositories/userRepository');

const createScore = async (data) => {
  const { error, value } = scoreInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check if the user exists
  const user = await userRepository.findById(value.userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if the game exists
  const game = await gameRepository.getGameById(value.gameId);
  if (!game) {
    throw new Error('Game not found');
  }

  // Score creation
  const newScore = await scoreRepository.createScore(value);
  
  // Output data validation
  const { error: outputError, value: validatedOutput } = scoreOutputSchema.validate(newScore);
  if (outputError) {
    throw new Error('Output data does not conform to the schema: ' + outputError.details[0].message);
  }
  
  return validatedOutput;
};

const getScores = async ({ page = 1, limit, userId, gameId }) => {
  let scores;

  if (limit !== undefined) {
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const offset = (pageInt - 1) * limitInt;

    // Retrieve scores with pagination
    scores = await scoreRepository.getScores({ userId, gameId, offset, limit: limitInt });
  } else {
    // No limit specified: retrieve all scores
    scores = await scoreRepository.getScores({ userId, gameId });
  }
  
  // Validation of each score with the output schema
  const validatedScores = scores.map(score => {
    const { error, value } = scoreOutputSchema.validate(score);
    if (error) {
      throw new Error('Output data for a score does not conform to the schema: ' + error.details[0].message);
    }
    return value;
  });
  
  return validatedScores;
};

const getScoreById = async (id) => {
  const score = await scoreRepository.getScoreById(id);
  if (!score) return null;
  
  // Output data validation
  const { error, value } = scoreOutputSchema.validate(score);
  if (error) {
    throw new Error('Output data does not conform to the schema: ' + error.details[0].message);
  }
  
  return value;
};

const updateScore = async (userId, gameId, data) => {
  const { error, value } = scoreUpdateSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  
  // Updating score (creating if it does not exist)
  const updatedScore = await scoreRepository.upsertScore(userId, gameId, value.score);
  
  // Output data validation
  const { error: outputError, value: validatedOutput } = scoreOutputSchema.validate(updatedScore);
  if (outputError) {
    throw new Error('Output data does not conform to the schema: ' + outputError.details[0].message);
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
