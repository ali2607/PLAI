const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerInputSchema, loginInputSchema } = require('../dto/auth.dto');
const userRepository = require('../../infrastructure/repositories/userRepository');

exports.registerUser = async (data) => {
  // Validation of registration data
  const { error, value } = registerInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const { username, email, password } = value;

  // Check if the user already exists
  const existingUser = await userRepository.findByUsername(username);
  if (existingUser) {
    throw new Error('Username already in use');
  }

  // Password hashing
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Creating the user in the database
  const newUser = await userRepository.createUser({
    username,
    email,
    passwordHash
  });

  // JWT token generation (valid for 1h)
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

exports.loginUser = async (data) => {
  // Validation of login data
  const { error, value } = loginInputSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const { username, password } = value;

  // Retrieving the user
  const user = await userRepository.findByUsername(username);
  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Password verification
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid username or password');
  }

  // JWT token generation
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};
