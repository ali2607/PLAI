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
    // The authenticated user is available in req.user thanks to the authentication middleware
    const userId = req.user.id;
    const { newPassword } = req.body;
    await userService.updatePassword(userId, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await userService.deleteAccount(userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const givePrivilege = async (req, res) => {
  try {
    const { targetUserId, newRole } = req.body;

    // Validation: Only ADMIN and USER are acceptable for modification
    if (!['ADMIN', 'USER'].includes(newRole)) {
      return res.status(400).json({ message: 'Invalid role. Allowed roles are ADMIN or USER.' });
    }

    const updatedUser = await userService.givePrivilege(targetUserId, newRole);
    return res.json({ message: 'Privilege updated successfully', user: updatedUser });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Retrieves the scores of a user for all the games they have played
const getUserScores = async (req, res) => {
  try {
    const { id } = req.params;
    
    const scores = await userService.getUserScores(parseInt(id));
    
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieves the games a user has played
const getUserGames = async (req, res) => {
  try {
    const { id } = req.params;
    
    const games = await userService.getUserGames(parseInt(id));
    
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
