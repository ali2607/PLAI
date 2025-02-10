const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification JWT
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: "Token d'authentification requis" });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token invalide ou manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }

    req.user = user;  // Injecte l'utilisateur dans la requête pour les prochaines étapes
    next();           // Passe au middleware ou contrôleur suivant
  });
};
