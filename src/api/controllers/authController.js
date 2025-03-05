// src/api/controllers/authController.js
const authService = require('../../application/services/authService');

exports.register = async (req, res) => {
  try {
    const token = await authService.registerUser(req.body);
    res.status(201).json({ message: 'Inscription réussie', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);
    res.json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


