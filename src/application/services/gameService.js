const Joi = require('joi');
const gameRepository = require('../../infrastructure/repositories/gameRepository');

// Schéma de validation pour Game
const gameSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

const createGame = async (data) => {
  const { error, value } = gameSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  // Vérifier l'unicité du nom
  const existingGame = await gameRepository.findByName(value.name);
  if (existingGame) {
    throw new Error('Un jeu avec ce nom existe déjà');
  }
  return await gameRepository.createGame(value);
};

const getGames = async ({ page = 1, limit = 10, name }) => {
  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const offset = (pageInt - 1) * limitInt;
  return await gameRepository.getGames({ name, offset, limit: limitInt });
};

const getGameById = async (id) => {
  return await gameRepository.getGameById(id);
};

const updateGame = async (id, data) => {
  const { error, value } = gameSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  // Vous pouvez ajouter ici une vérification d'existence si besoin
  return await gameRepository.updateGame(id, value);
};

const deleteGame = async (id) => {
  return await gameRepository.deleteGame(id);
};

module.exports = {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
};
