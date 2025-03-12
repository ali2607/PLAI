const { gameInputSchema, gameOutputSchema } = require('../dto/game.dto');
const gameRepository = require('../../infrastructure/repositories/gameRepository');

const createGame = async (data) => {
  const { error, value } = gameInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  // Vérifier l'unicité du nom
  const existingGame = await gameRepository.findByName(value.name);
  if (existingGame) {
    throw new Error('Un jeu avec ce nom existe déjà');
  }
  // Création du jeu
  const newGame = await gameRepository.createGame(value);
  
  // Validation des données de sortie
  const { error: outputError, value: validatedOutput } = gameOutputSchema.validate(newGame);
  if (outputError) {
    throw new Error('Les données de sortie ne respectent pas le schéma : ' + outputError.details[0].message);
  }
  
  return validatedOutput;};

const getGames = async ({ page = 1, limit = 10, name }) => {
  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const offset = (pageInt - 1) * limitInt;
    // Récupérer les jeux depuis le dépôt
    const games = await gameRepository.getGames({ name, offset, limit: limitInt });
  
    // Validation de chaque jeu avec le schéma de sortie
    const validatedGames = games.map(game => {
      const { error, value } = gameOutputSchema.validate(game);
      if (error) {
        throw new Error('Les données de sortie pour un jeu ne respectent pas le schéma : ' + error.details[0].message);
      }
      return value;
    });
    
    return validatedGames;
};

const getGameById = async (id) => {
  const game = await gameRepository.getGameById(id);
  if (!game) return null;
  
  // Validation des données de sortie
  const { error, value } = gameOutputSchema.validate(game);
  if (error) {
    throw new Error('Les données de sortie ne respectent pas le schéma : ' + error.details[0].message);
  }
  
  return value;
};

const updateGame = async (id, data) => {
  const { error, value } = gameInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const updatedGame = await gameRepository.updateGame(id, value);
  
  // Validation des données de sortie
  const { error: outputError, value: validatedOutput } = gameOutputSchema.validate(updatedGame);
  if (outputError) {
    throw new Error('Les données de sortie ne respectent pas le schéma : ' + outputError.details[0].message);
  }
  
  return validatedOutput;
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
