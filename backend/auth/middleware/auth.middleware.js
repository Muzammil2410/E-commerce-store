/**
 * Auth middleware - verify JWT and optional role-based access
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';

/**
 * Verify JWT and attach req.user (id, email, role)
 * Use on routes that require authentication.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    console.log('[Auth] Failure: No token provided');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    console.log('[Auth] Failure: Invalid or expired token');
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

/**
 * Restrict access to specific roles
 * Use after verifyToken: e.g. router.get('/seller-only', verifyToken, roleBasedAccess(['seller']))
 * @param {string[]} roles - Allowed roles, e.g. ['seller'], ['admin'], ['employee', 'admin']
 */
function roleBasedAccess(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      console.log('[Auth] Failure: Role not allowed', { role: req.user.role, allowed: roles });
      return res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  roleBasedAccess,
};
