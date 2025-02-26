// src/api/controllers/authController.js
const authService = require('../../application/services/authService');

exports.register = async (req, res) => {
  try {
    const token = await authService.registerUser(req.body);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Connexion réussie' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
