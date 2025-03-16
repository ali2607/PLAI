const jwt = require('jsonwebtoken');

/**
 * Extracts the token from the Authorization header
 * @param {Object} req - Express Request object
 * @returns {String} JWT token
 * @throws {Error}
 */
function extractToken(req) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    throw new Error('NoAuthHeader');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('MissingToken');
  }

  return token;
}

/**
 * Verifies the validity of the JWT token
 * @param {String} token 
 * @param {String} secret 
 * @returns {Promise<Object>} Decoded token payload
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
 * Authentication middleware
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @param {Function} next - Callback function to pass to the next middleware
 */
async function authenticate(req, res, next) {
  try {
    // 1. Extract the token from the header
    const token = extractToken(req);
    // 2. Verify and decode the token
    const user = await verifyJwtToken(token, process.env.JWT_SECRET);
    // 3. Inject the user into the request
    req.user = user;
    
    // 4. Pass to the next middleware or controller
    next();
    
  } catch (error) {
    // Precise error handling based on the context
    if (error.message === 'NoAuthHeader') {
      return res.status(401).json({ message: 'Authentication token required' });
    }
    if (error.message === 'MissingToken') {
      return res.status(401).json({ message: 'Invalid or missing token' });
    }
    // Other errors (signature error, expiration, etc.)
    return res.status(403).json({ message: 'Invalid token' });
  }
}

function authorizeRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

function authorizeRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

module.exports = {
  extractToken,
  verifyJwtToken,
  authenticate,
  authorizeRole,
  authorizeRoles
};
