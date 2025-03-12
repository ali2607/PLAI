const Joi = require('joi');

// Schéma pour la mise à jour du mot de passe
const updatePasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
});

const usernameOutputSchema = Joi.object({
    username: Joi.string().required(),
  });

module.exports = {
  updatePasswordSchema,
  usernameOutputSchema
};
