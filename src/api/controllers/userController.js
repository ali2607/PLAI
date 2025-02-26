const userService = require('../../application/services/userService');

const getUsernames = async (req, res) => {
  try {
    const { page, limit, username } = req.query;
    const users = await userService.getUsernames({ page, limit, username });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    // L'utilisateur authentifié est disponible dans req.user grâce au middleware d'authentification
    const userId = req.user.id;
    const { newPassword } = req.body;
    await userService.updatePassword(userId, newPassword);
    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await userService.deleteAccount(userId);
    res.json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsernames,
  updatePassword,
  deleteAccount,
};
