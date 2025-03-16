const Joi = require('joi');

// Schema for updating the password
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

// Schema for user scores
const userScoreOutputSchema = Joi.object({
  gameId: Joi.number().integer().required(),
  gameName: Joi.string().required(),
  score: Joi.number().integer().min(0).required(),
  createdAt: Joi.date().required()
});

// Schema for games played by a user
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
