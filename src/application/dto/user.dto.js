const Joi = require('joi');

// Schéma pour la mise à jour du mot de passe
const updatePasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
});

const usernameOutputSchema = Joi.object({
    username: Joi.string().required(),
  });
  
const usersOutputSchema = Joi.object({
  id: Joi.number().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('ROOT', 'ADMIN', 'USER').required(),
  createdAt: Joi.date().required(),
});

// Schéma pour les scores d'un utilisateur
const userScoreOutputSchema = Joi.object({
  gameId: Joi.number().integer().required(),
  gameName: Joi.string().required(),
  score: Joi.number().integer().min(0).required(),
  createdAt: Joi.date().required()
});

// Schéma pour les jeux joués par un utilisateur
const userGameOutputSchema = Joi.object({
  gameId: Joi.number().integer().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  playedAt: Joi.date().required()
});

module.exports = {
  updatePasswordSchema,
  usernameOutputSchema,
  usersOutputSchema,
  userGameOutputSchema,
  userScoreOutputSchema
};
