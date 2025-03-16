const Joi = require('joi');

// Input schema for a score
const scoreInputSchema = Joi.object({
  userId: Joi.number().integer().required(),
  gameId: Joi.number().integer().required(),
  score: Joi.number().integer().min(0).required(),
});

// Input schema for updating a score
const scoreUpdateSchema = Joi.object({
  score: Joi.number().integer().min(0).required(),
});

// Output schema for a score
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