const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    // Extract token from Authorization header (Bearer token)
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      // Verify token validity and decode payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded user (id, role, etc) for downstream use

      // Role-based access control: check if user's role is permitted
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Passed auth and roles, proceed to next middleware/controller
      next();
    } catch (err) {
      // Invalid token or verification failure
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = authMiddleware;
