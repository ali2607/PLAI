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

module.exports = {
  gameInputSchema,
  gameOutputSchema,
};
