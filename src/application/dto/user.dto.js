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

module.exports = {
  updatePasswordSchema,
  usernameOutputSchema,
  usersOutputSchema
};
