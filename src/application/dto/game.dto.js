const Joi = require('joi');

// Input schema for a game
const gameInputSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

// Output schema for a game
const gameOutputSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  createdAt: Joi.date().required(),
});

// Schema for game scores (per user)
const gameScoreOutputSchema = Joi.object({
  userId: Joi.number().integer().required(),
  username: Joi.string().required(),
  score: Joi.number().integer().min(0).required(),
  createdAt: Joi.date().required()
});

// Schema for users who played a game
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
