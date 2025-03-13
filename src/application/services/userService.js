const userRepository = require('../../infrastructure/repositories/userRepository');
const bcrypt = require('bcrypt');
const { updatePasswordSchema, usernameOutputSchema, usersOutputSchema } = require('../dto/user.dto');


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

module.exports = {
  getUsernames,
  getUsers,
  updatePassword,
  deleteAccount,
  givePrivilege
};
