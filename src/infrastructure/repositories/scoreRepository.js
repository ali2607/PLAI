const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createScore = async (scoreData) => {
  return await prisma.score.create({
    data: scoreData,
    include: {
      user: {
        select: {
          username: true,
        },
      },
      game: {
        select: {
          name: true,
        },
      },
    },
  });
};

const getScores = async ({ userId, gameId, offset, limit }) => {
  const filter = {};
  
  if (userId) filter.userId = parseInt(userId);
  if (gameId) filter.gameId = parseInt(gameId);

  return await prisma.score.findMany({
    where: filter,
    include: {
      user: {
        select: {
          username: true,
        },
      },
      game: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      score: 'desc',
    },
    skip: offset,
    take: limit,
  });
};

const getScoreById = async (id) => {
  return await prisma.score.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      game: {
        select: {
          name: true,
        },
      },
    },
  });
};

const getUserGameScore = async (userId, gameId) => {
  return await prisma.score.findUnique({
    where: {
      userId_gameId: {
        userId: parseInt(userId),
        gameId: parseInt(gameId),
      },
    },
  });
};

const updateScore = async (id, data) => {
  return await prisma.score.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          username: true,
        },
      },
      game: {
        select: {
          name: true,
        },
      },
    },
  });
};

const upsertScore = async (userId, gameId, score) => {
  return await prisma.score.upsert({
    where: {
      userId_gameId: {
        userId: parseInt(userId),
        gameId: parseInt(gameId),
      },
    },
    update: {
      score: score,
    },
    create: {
      userId: parseInt(userId),
      gameId: parseInt(gameId),
      score: score,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      game: {
        select: {
          name: true,
        },
      },
    },
  });
};

const deleteScore = async (id) => {
  return await prisma.score.delete({
    where: { id },
  });
};

const getUserScores = async (userId) => {
  return await prisma.score.findMany({
    where: { userId: parseInt(userId) },
    include: {
      game: true,
    },
    orderBy: {
      score: 'desc',
    }
  });
};

const getGamesByUserId = async (userId) => {
  return await prisma.score.findMany({
    where: { userId: parseInt(userId) },
    include: {
      game: true,
    },
    distinct: ['gameId'],
    orderBy: {
      createdAt: 'desc',
    }
  });
};

const getScoresByGameId = async (gameId) => {
  return await prisma.score.findMany({
    where: { gameId: parseInt(gameId) },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      score: 'desc',
    }
  });
};

const getUsersByGameId = async (gameId) => {
  return await prisma.score.findMany({
    where: { gameId: parseInt(gameId) },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      score: 'desc',
    }
  });
};

module.exports = {
  createScore,
  getScores,
  getScoreById,
  getUserGameScore,
  updateScore,
  upsertScore,
  deleteScore,
  getUserScores,
  getUsersByGameId,
  getGamesByUserId,
  getScoresByGameId
};