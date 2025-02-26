const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createGame = async (gameData) => {
  return await prisma.game.create({
    data: gameData,
  });
};

const findByName = async (name) => {
  return await prisma.game.findUnique({
    where: { name },
  });
};

const getGames = async ({ name, offset, limit }) => {
  const filter = name ? { name: { contains: name, mode: 'insensitive' } } : {};
  return await prisma.game.findMany({
    where: filter,
    skip: offset,
    take: limit,
  });
};

const getGameById = async (id) => {
  return await prisma.game.findUnique({
    where: { id },
  });
};

const updateGame = async (id, data) => {
  return await prisma.game.update({
    where: { id },
    data,
  });
};

const deleteGame = async (id) => {
  return await prisma.game.delete({
    where: { id },
  });
};

module.exports = {
  createGame,
  findByName,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
};
