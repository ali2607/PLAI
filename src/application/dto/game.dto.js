const Joi = require('joi');

// Schéma d'entrée pour un jeu
const gameInputSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

// Schéma de sortie pour un jeu
const gameOutputSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  createdAt: Joi.date().required(),
});

// Schéma pour les scores d'un jeu (par utilisateur)
const gameScoreOutputSchema = Joi.object({
  userId: Joi.number().integer().required(),
  username: Joi.string().required(),
  score: Joi.number().integer().min(0).required(),
  createdAt: Joi.date().required()
});

// Schéma pour les utilisateurs ayant joué à un jeu
const gameUserOutputSchema = Joi.object({
  userId: Joi.number().integer().required(),
  username: Joi.string().required(),
  score: Joi.number().integer().min(0).required(),
  playedAt: Joi.date().required()
});

module.exports = {
  gameInputSchema,
  gameOutputSchema,
  gameUserOutputSchema,
  gameScoreOutputSchema
};
