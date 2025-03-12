// src/infrastructure/repositories/userRepository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.findByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username }
  });
};

exports.findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) }
  });
};

exports.createUser = async (userData) => {
  return await prisma.user.create({
    data: userData
  });
};

exports.getUsernames = async ({ username, offset, limit }) => {
  const filter = username
    ? { username: { contains: username, mode: 'insensitive' } }
    : {};
  return await prisma.user.findMany({
    where: filter,
    select: { username: true },
    skip: offset,
    take: limit,
  });
};

exports.updatePassword = async (id, newPasswordHash) => {
  return await prisma.user.update({
    where: { id },
    data: { passwordHash: newPasswordHash },
  });
};

exports.deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};

exports.updateUserRole = async (id, newRole) => {
  return await prisma.user.update({
    where: { id },
    data: { role: newRole },
  });
};