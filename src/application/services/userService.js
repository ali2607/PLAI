const userRepository = require('../../infrastructure/repositories/userRepository');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const getUsernames = async ({ page = 1, limit = 10, username }) => {
  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const offset = (pageInt - 1) * limitInt;
  return await userRepository.getUsernames({ username, offset, limit: limitInt });
};

const updatePassword = async (userId, newPassword) => {
  // Validation du nouveau mot de passe
  const schema = Joi.object({
    newPassword: Joi.string().min(6).required(),
  });
  const { error, value } = schema.validate({ newPassword });
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
  updatePassword,
  deleteAccount,
  givePrivilege
};
