const Joi = require('joi');

// Schéma d'entrée pour un score
const scoreInputSchema = Joi.object({
  userId: Joi.number().integer().required(),
  gameId: Joi.number().integer().required(),
  score: Joi.number().integer().min(0).required(),
});

// Schéma d'entrée pour la mise à jour d'un score
const scoreUpdateSchema = Joi.object({
  score: Joi.number().integer().min(0).required(),
});

// Schéma de sortie pour un score
const scoreOutputSchema = Joi.object({
  id: Joi.number().integer().required(),
  score: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
  gameId: Joi.number().integer().required(),
  createdAt: Joi.date().required(),
  user: Joi.object({
    username: Joi.string().required(),
  }),
  game: Joi.object({
    name: Joi.string().required(),
  }),
});

module.exports = {
  scoreInputSchema,
  scoreUpdateSchema,
  scoreOutputSchema,
};