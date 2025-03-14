const userRepository = require('../../infrastructure/repositories/userRepository');
const scoreRepository = require('../../infrastructure/repositories/scoreRepository');
const bcrypt = require('bcrypt');
const { updatePasswordSchema, usernameOutputSchema, usersOutputSchema,userScoreOutputSchema, userGameOutputSchema } = require('../dto/user.dto');

  const getUsernames = async ({ page = 1, limit, username }) => {
    let users;

    if (limit !== undefined) {
      const pageInt = parseInt(page);
      const limitInt = parseInt(limit);
      const offset = (pageInt - 1) * limitInt;

      // Récupérer les usernames avec pagination
      users = await userRepository.getUsernames({ username, offset, limit: limitInt });
    } else {
      // Aucun limit précisé : récupérer l'intégralité des usernames
      users = await userRepository.getUsernames({ username });
    }

    // Validation de chaque objet utilisateur avec le schéma de sortie
    const validatedUsers = users.map(user => {
      const { error, value } = usernameOutputSchema.validate(user);
      if (error) {
        throw new Error(
          "Les données de sortie pour un utilisateur ne respectent pas le schéma : " +
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

      // Récupérer les usernames avec pagination
      users = await userRepository.getUsers({ username, offset, limit: limitInt });
    } else {
      // Aucun limit précisé : récupérer l'intégralité des usernames
      users = await userRepository.getUsers({ username });
    }

    // Validation de chaque objet utilisateur avec le schéma de sortie
    const validatedUsers = users.map(user => {
      const { error, value } = usersOutputSchema.validate(user);
      if (error) {
        throw new Error('Les données de sortie pour un utilisateur ne respectent pas le schéma : ' + error.details[0].message);
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

  // Hachage du nouveau mot de passe
  const newPasswordHash = await bcrypt.hash(value.newPassword, 10);
  return await userRepository.updatePassword(userId, newPasswordHash);
};

const deleteAccount = async (userId) => {
  return await userRepository.deleteUser(userId);
};

const givePrivilege = async (targetUserId, newRole) => {
  // Vous pouvez ajouter ici une logique supplémentaire (ex : vérifier si l'utilisateur cible existe)
  return await userRepository.updateUserRole(targetUserId, newRole);
};

/**
 * Récupère les scores d'un utilisateur pour tous les jeux auxquels il a joué
 */
const getUserScores = async (userId) => {
  // Vérifier si l'utilisateur existe
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  // Récupérer les scores de l'utilisateur avec les noms de jeux
  const scores = await scoreRepository.getUserScores(userId);
  
  // Transformer et valider les données avec le DTO
  const validatedScores = scores.map(score => {
    const scoreData = {
      gameId: score.gameId,
      gameName: score.game.name,
      score: score.score,
      createdAt: score.createdAt
    };
    
    const { error, value } = userScoreOutputSchema.validate(scoreData);
    if (error) {
      throw new Error('Les données de sortie pour un score ne respectent pas le schéma : ' + error.details[0].message);
    }
    return value;
  });
  
  return validatedScores;
};

/**
 * Récupère les jeux auxquels un utilisateur a joué
 */
const getUserGames = async (userId) => {
  // Vérifier si l'utilisateur existe
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Récupérer les jeux joués par l'utilisateur
  const games = await scoreRepository.getGamesByUserId(userId);
  
  // Transformer et valider les données avec le DTO
  const validatedGames = games.map(item => {
    const gameData = {
      gameId: item.game.id,
      name: item.game.name,
      description: item.game.description,
      playedAt: item.createdAt
    };
    
    const { error, value } = userGameOutputSchema.validate(gameData);
    if (error) {
      throw new Error('Les données de sortie pour un jeu ne respectent pas le schéma : ' + error.details[0].message);
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
