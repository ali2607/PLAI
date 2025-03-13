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

const getUsers = async (req, res) => {
  try {
    const { page, limit, username } = req.query;
    const users = await userService.getUsers({ page, limit, username });
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

const givePrivilege = async (req, res) => {
  try {
    const { targetUserId, newRole } = req.body;

    // Validation : Seuls ADMIN et USER sont acceptables pour une modification
    if (!['ADMIN', 'USER'].includes(newRole)) {
      return res.status(400).json({ message: 'Rôle non valide. Les rôles autorisés sont ADMIN ou USER.' });
    }

    const updatedUser = await userService.givePrivilege(targetUserId, newRole);
    return res.json({ message: 'Privilège mis à jour avec succès', user: updatedUser });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Récupère les scores d'un utilisateur pour tous les jeux auxquels il a joué
const getUserScores = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const scores = await userService.getUserScores(
      parseInt(id), 
      { page: parseInt(page), limit: parseInt(limit) }
    );
    
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupère les jeux auxquels un utilisateur a joué
const getUserGames = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const games = await userService.getUserGames(
      parseInt(id), 
      { page: parseInt(page), limit: parseInt(limit) }
    );
    
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getUsernames,
  getUsers,
  updatePassword,
  deleteAccount,
  givePrivilege,
  getUserGames,
  getUserScores
};
