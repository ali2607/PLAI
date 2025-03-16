const Joi = require('joi');

// Input schema for registration
const registerInputSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
});

// Input schema for login
const loginInputSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerInputSchema,
  loginInputSchema,
};
