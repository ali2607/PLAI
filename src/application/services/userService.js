const userRepository = require('../../infrastructure/repositories/userRepository');
const scoreRepository = require('../../infrastructure/repositories/scoreRepository');
const bcrypt = require('bcrypt');
const { updatePasswordSchema, usernameOutputSchema, usersOutputSchema, userScoreOutputSchema, userGameOutputSchema } = require('../dto/user.dto');

const getUsernames = async ({ page = 1, limit, username }) => {
  let users;

  if (limit !== undefined) {
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const offset = (pageInt - 1) * limitInt;

    // Retrieve usernames with pagination
    users = await userRepository.getUsernames({ username, offset, limit: limitInt });
  } else {
    // No limit specified: retrieve all usernames
    users = await userRepository.getUsernames({ username });
  }

  // Validate each user object with the output schema
  const validatedUsers = users.map(user => {
    const { error, value } = usernameOutputSchema.validate(user);
    if (error) {
      throw new Error(
        "Output data for a user does not comply with the schema: " +
          error.details[0].message
      );
    }
    return value;
  });

  return validatedUsers;
};


const getUsers = async ({ page = 1, limit, username }) => {
  let users;

  if (limit !== undefined) {
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const offset = (pageInt - 1) * limitInt;

    // Retrieve users with pagination
    users = await userRepository.getUsers({ username, offset, limit: limitInt });
  } else {
    // No limit specified: retrieve all users
    users = await userRepository.getUsers({ username });
  }

  // Validate each user object with the output schema
  const validatedUsers = users.map(user => {
    const { error, value } = usersOutputSchema.validate(user);
    if (error) {
      throw new Error('Output data for a user does not comply with the schema: ' + error.details[0].message);
    }
    return value;
  });
  
  return validatedUsers;
};

const updatePassword = async (userId, newPassword) => {
  const { error, value } = updatePasswordSchema.validate({ newPassword });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Hash the new password
  const newPasswordHash = await bcrypt.hash(value.newPassword, 10);
  return await userRepository.updatePassword(userId, newPasswordHash);
};

const deleteAccount = async (userId) => {
  return await userRepository.deleteUser(userId);
};

const givePrivilege = async (targetUserId, newRole) => {
  // You can add additional logic here (e.g., check if the target user exists)
  return await userRepository.updateUserRole(targetUserId, newRole);
};

/**
 * Retrieves the scores of a user for all the games they have played
 */
const getUserScores = async (userId) => {
  // Check if the user exists
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Retrieve the user's scores with the game names
  const scores = await scoreRepository.getUserScores(userId);
  
  // Transform and validate the data with the DTO
  const validatedScores = scores.map(score => {
    const scoreData = {
      gameId: score.gameId,
      gameName: score.game.name,
      score: score.score,
      createdAt: score.createdAt
    };
    
    const { error, value } = userScoreOutputSchema.validate(scoreData);
    if (error) {
      throw new Error('Output data for a score does not comply with the schema: ' + error.details[0].message);
    }
    return value;
  });
  
  return validatedScores;
};

/**
 * Retrieves the games a user has played
 */
const getUserGames = async (userId) => {
  // Check if the user exists
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Retrieve the games played by the user
  const games = await scoreRepository.getGamesByUserId(userId);
  
  // Transform and validate the data with the DTO
  const validatedGames = games.map(item => {
    const gameData = {
      gameId: item.game.id,
      name: item.game.name,
      description: item.game.description,
      playedAt: item.createdAt
    };
    
    const { error, value } = userGameOutputSchema.validate(gameData);
    if (error) {
      throw new Error('Output data for a game does not comply with the schema: ' + error.details[0].message);
    }
    return value;
  });
  
  return validatedGames;
};

module.exports = {
  getUsernames,
  getUsers,
  updatePassword,
  deleteAccount,
  givePrivilege,
  getUserScores,
  getUserGames
};
