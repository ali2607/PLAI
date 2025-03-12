const Joi = require('joi');

// Schéma d'entrée pour l'inscription
const registerInputSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
});

// Schéma d'entrée pour la connexion
const loginInputSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
});

// Schéma de sortie pour un utilisateur (exemple d'utilisation)
const userOutputSchema = Joi.object({
  id: Joi.number().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('ROOT', 'ADMIN', 'USER').required(),
  createdAt: Joi.date().required(),
});

module.exports = {
  registerInputSchema,
  loginInputSchema,
  userOutputSchema,
};
