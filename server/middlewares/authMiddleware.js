// server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// A generic middleware to protect routes with a valid token
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains { id, role } from the JWT payload
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Not authorized, token failed' });
  }
};

// Middleware factory to check for specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // The role is available from the `protect` middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };