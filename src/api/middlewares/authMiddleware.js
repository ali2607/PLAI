const jwt = require('jsonwebtoken');

/**
 * Récupère le token depuis l'en-tête Authorization
 * @param {Object} req - Objet Request d'Express
 * @returns {String} token JWT
 * @throws {Error}
 */
function extractToken(req) {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: "Token d'authentification requis" });
  }  
  return token;
}

/**
 * Vérifie la validité du token JWT
 * @param {String} token 
 * @param {String} secret 
 * @returns {Promise<Object>} Payload décodé du token
 */
function verifyJwtToken(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

/**
 * Middleware d'authentification
 * @param {Object} req - Objet Request d'Express
 * @param {Object} res - Objet Response d'Express
 * @param {Function} next - Fonction de callback pour passer au middleware suivant
 */
async function authenticate(req, res, next) {
  try {
    // 1. Extraction du token depuis l'en-tête
    const token = extractToken(req);
    
    // 2. Vérification et décodage du token
    const user = await verifyJwtToken(token, process.env.JWT_SECRET);
    
    // 3. Injection de l'utilisateur dans la requête
    req.user = user;
    
    // 4. Passage au middleware ou contrôleur suivant
    next();
    
  } catch (error) {
    // Gestion d'erreur précise en fonction du contexte
    if (error.message === 'NoAuthHeader') {
      return res.status(401).json({ message: "Token d'authentification requis" });
    }
    if (error.message === 'MissingToken') {
      return res.status(401).json({ message: "Token invalide ou manquant" });
    }
    // Autres erreurs (erreur de signature, expiration, etc.)
    return res.status(403).json({ message: 'Token invalide' });
  }
}

// On peut également exporter les fonctions utiles pour de futurs usages
module.exports = {
  extractToken,
  verifyJwtToken,
  authenticate
};
