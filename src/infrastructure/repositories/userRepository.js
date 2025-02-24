// src/infrastructure/repositories/userRepository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.findByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username }
  });
};

exports.createUser = async (userData) => {
  return await prisma.user.create({
    data: userData
  });
};
