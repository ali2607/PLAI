// src/application/services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerInputSchema, loginInputSchema } = require('../dto/auth.dto');
const userRepository = require('../../infrastructure/repositories/userRepository');


exports.registerUser = async (data) => {
  // Validation des données d'inscription
  const { error, value } = registerInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const { username, password } = value;

  // Vérification de l'existence de l'utilisateur
  const existingUser = await userRepository.findByUsername(username);
  if (existingUser) {
    throw new Error('Nom d’utilisateur déjà utilisé');
  }

  // Hachage du mot de passe
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Création de l'utilisateur dans la BDD
  const newUser = await userRepository.createUser({
    username,
    passwordHash
  });

  // Génération du token JWT (valable 1h)
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

exports.loginUser = async (data) => {
  // Validation des données de connexion
  const { error, value } = loginInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const { username, password } = value;

  // Récupération de l'utilisateur
  const user = await userRepository.findByUsername(username);
  if (!user) {
    throw new Error('Nom d’utilisateur ou mot de passe invalide');
  }

  // Vérification du mot de passe
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Nom d’utilisateur ou mot de passe invalide');
  }

  // Génération du token JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};
