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
  password: Joi.string().required(),
});

module.exports = {
  registerInputSchema,
  loginInputSchema,
};
